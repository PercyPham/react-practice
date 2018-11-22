import to from "await-to-js";
import mongoose from "mongoose";
import frontmatter from "front-matter";

import generateSlug from "../utils/slugify";
import Chapter from "./Chapter";
import Purchase from "./Purchase";

import { getCommits, getContent } from "../github";
import { stripeCharge } from "../stripe";
import getEmailTemplate from "./EmailTemplate";
import sendEmail from "../aws";
import logger from "../utils/logs";

const ROOT_URL =
  process.env.ROOT_URL || `http://localhost:${process.env.PORT || 8000}`;

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  price: {
    type: Number,
    required: true
  },
  githubRepo: {
    type: String,
    required: true
  },
  githubLastCommitSha: String
});

class BookClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const books = await this.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    return { books };
  }

  static async getBySlug({ slug }) {
    const bookDoc = await this.findOne({ slug });

    if (!bookDoc) {
      throw new Error("Book not found");
    }

    const book = bookDoc.toObject();

    book.chapters = (await Chapter.find(
      { bookId: book._id },
      "title slug"
    ).sort({ order: 1 })).map(chapter => chapter.toObject());

    return book;
  }

  static async add({ name, price, githubRepo }) {
    const [err, slug] = await to(generateSlug(this, name));

    if (err) {
      throw new Error("Error with slug generation");
    }

    return this.create({
      name,
      slug,
      price,
      githubRepo
    });
  }

  static async edit({ id, name, price, githubRepo }) {
    const book = await this.findById(id, "slug name");

    if (!book) {
      throw new Error("Book is not found by id");
    }

    const modifier = { price, githubRepo };

    if (name !== book.name) {
      modifier.name = name;
      modifier.slug = await generateSlug(this, name);
    }

    await this.updateOne({ _id: id }, { $set: modifier });

    const editedBook = await this.findById(id, "slug");

    return editedBook;
  }

  static async syncContent({ id, githubAccessToken }) {
    const book = await this.findById(id, "githubRepo githubLastCommitSha");

    if (!book) {
      throw new Error("Book not found");
    }

    const lastCommit = await getCommits({
      accessToken: githubAccessToken,
      repoName: book.githubRepo,
      limit: 1
    });

    if (!lastCommit || !lastCommit.data || !lastCommit.data[0]) {
      throw new Error("No change in content!");
    }

    const lastCommitSha = lastCommit.data[0].sha;
    if (lastCommitSha === book.githubLastCommitSha) {
      throw new Error("No change in content!");
    }

    const mainFolder = await getContent({
      accessToken: githubAccessToken,
      repoName: book.githubRepo,
      path: ""
    });

    await Promise.all(
      mainFolder.data.map(async f => {
        if (f.type !== "file") {
          return;
        }

        if (
          f.path !== "introduction.md" &&
          !/chapter-([0-9]+)\.md/.test(f.path)
        ) {
          return;
        }

        const chapter = await getContent({
          accessToken: githubAccessToken,
          repoName: book.githubRepo,
          path: f.path
        });

        const data = frontmatter(
          Buffer.from(chapter.data.content, "base64").toString("utf8")
        );

        data.path = f.path;

        try {
          await Chapter.syncContent({ book, data });
          logger.info("Content is synced", { path: f.path });
        } catch (error) {
          logger.error("Content sync has error", { path: f.path, error });
        }
      })
    );

    return book.updateOne({ githubLastCommitSha: lastCommitSha });
  }

  static async buy({ id, user, stripeToken }) {
    if (!user) {
      throw new Error("User required");
    }

    const book = await this.findById(id, "name slug price");
    if (!book) {
      throw new Error("Book not found");
    }

    const isPurchased =
      (await Purchase.find({ userId: user._id, bookId: id }).countDocuments()) >
      0;
    if (isPurchased) {
      throw new Error("Already bought this book");
    }

    const chargeObj = await stripeCharge({
      amount: book.price * 100,
      token: stripeToken.id,
      buyerEmail: user.email
    });

    const template = await getEmailTemplate("purchase", {
      userName: user.displayName,
      bookTitle: book.name,
      bookUrl: `${ROOT_URL}/books/${book.slug}/introduction`
    });

    try {
      await sendEmail({
        from: `Kelly from builderbook.org <${
          process.env.EMAIL_SUPPORT_FROM_ADDRESS
        }>`,
        to: [user.email],
        subject: template.subject,
        body: template.message
      });
    } catch (error) {
      logger.error("Email sending error:", error);
    }

    return Purchase.create({
      userId: user._id,
      bookId: book._id,
      amount: book.price * 100,
      stripeCharge: chargeObj,
      createdAt: new Date()
    });
  }
}

mongoSchema.loadClass(BookClass);

const Book = mongoose.model("Book", mongoSchema);

export default Book;

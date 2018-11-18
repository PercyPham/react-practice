import mongoose from "mongoose";
import to from "await-to-js";
import generateSlug from "../utils/slugify";
import Chapter from "./Chapter";

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
}

mongoSchema.loadClass(BookClass);

const Book = mongoose.model("Book", mongoSchema);

export default Book;

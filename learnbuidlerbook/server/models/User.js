import mongoose from "mongoose";
import lodashIsEmpty from "lodash.isempty";
import lodashPick from "lodash.pick";
import generateSlug from "../utils/slugify";
import sendEmail from "../aws/sendEmail";
import getEmailTemplate from "./EmailTemplate";
import logger from "../utils/logs";

const { Schema } = mongoose;

const mongoSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  googleToken: {
    access_token: String,
    refresh_token: String,
    token_type: String,
    expiry_date: Number
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  displayName: String,
  avatarUrl: String,

  isGithubConnected: {
    type: Boolean,
    default: false
  },
  githubAccessToken: {
    type: String
  }
});

class UserClass {
  static publicFields() {
    return [
      "id",
      "displayName",
      "email",
      "avatarUrl",
      "slug",
      "isAdmin",
      "isGithubConnected"
    ];
  }

  static async signInOrSignUp({
    googleId,
    email,
    googleToken,
    displayName,
    avatarUrl
  }) {
    const user = await this.findOne({ googleId }).select(
      UserClass.publicFields().join(" ")
    );

    if (user) {
      const modifier = {};

      if (googleToken.accessToken) {
        modifier.access_token = googleToken.accessToken;
      }

      if (googleToken.refreshToken) {
        modifier.refresh_token = googleToken.refreshToken;
      }

      if (lodashIsEmpty(modifier)) {
        return user;
      }

      await this.updateOne({ googleId }, { $set: modifier });

      return user;
    }

    const slug = await generateSlug(this, displayName);
    const userCount = await this.find().countDocuments();

    const newUser = await this.create({
      createdAt: new Date(),
      googleId,
      email,
      googleToken,
      displayName,
      avatarUrl,
      slug,
      isAdmin: userCount === 0
    });

    const template = await getEmailTemplate("welcome", {
      userName: displayName
    });

    try {
      await sendEmail({
        from: `Hung from LearnBuilder Book <${
          process.env.EMAIL_SUPPORT_FROM_ADDRESS
        }>`,
        to: [email],
        subject: template.subject,
        body: template.message
      });
    } catch (err) {
      logger.error("Email sending error:", err);
    }

    return lodashPick(newUser, UserClass.publicFields());
  }
}

mongoSchema.loadClass(UserClass);

const User = mongoose.model("User", mongoSchema);

export default User;

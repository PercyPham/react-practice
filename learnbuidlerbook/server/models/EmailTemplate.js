import mongoose from "mongoose";
import lodashTemplate from "lodash.template";
import logger from "../utils/logs";

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const EmailTemplate = mongoose.model("EmailTemplate", mongoSchema);

function insertTemplates() {
  const templates = [
    {
      name: "welcome",
      subject: "Welcome to builderbook.org",
      message: `<%= userName %>,
        <p>
          Thanks for signing up for Builder Book!
        </p>
        <p>
          In our books, we teach you how to build complete, production-ready web apps from scratch.
        </p>
        Hung, Team LearnBuilder Book
      `
    }
  ];

  templates.forEach(async template => {
    if ((await EmailTemplate.find({ name: template.name }).count()) > 0) {
      return;
    }

    EmailTemplate.create(template).catch(error => {
      logger.error("EmailTemplate insertion error:", error);
    });
  });
}

insertTemplates();

export default async function getEmailTemplate(name, params) {
  const source = await EmailTemplate.findOne({ name });
  if (!source) {
    throw new Error(
      "No EmailTemplates found. Please check that at least one is generated at server startup, restart your server and try again."
    );
  }

  return {
    message: lodashTemplate(source.message)(params),
    subject: lodashTemplate(source.subject)(params)
  };
}

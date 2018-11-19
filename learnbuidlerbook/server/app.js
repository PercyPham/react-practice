import dotenv from "dotenv";
import express from "express";
import next from "next";
import mongoose from "mongoose";
import session from "express-session";
import mongoSessionStore from "connect-mongo";
import auth from "./google";
import logger from "./utils/logs";
import api from "./api";
import routesWithSlug from "./routesWithSlug";
import { setupGithub as github } from "./github";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const MONGO_URL = process.env.MONGO_URL_TEST;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};
mongoose.connect(
  MONGO_URL,
  options
);

const port = process.env.PORT || 3000;
const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  const MongoStore = mongoSessionStore(session);

  const sess = {
    name: "builderbook.sid",
    secret: "cWZ5yIIq90DcYYJ",
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60 // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000
    }
  };

  server.use(session(sess));

  auth({ server, ROOT_URL });
  github({ server });
  api(server);
  routesWithSlug({ server, app });

  server.get("/books/:bookSlug/:chapterSlug", (req, res) => {
    const { bookSlug, chapterSlug } = req.params;
    app.render(req, res, "/public/read-chapter", { bookSlug, chapterSlug });
  });

  server.get("*", (req, res) => {
    const URL_MAP = {
      "/login": "/public/login",
      "/my-books": "/customer/my-books"
    };
    const url = URL_MAP[req.path];
    if (url) {
      app.render(req, res, url);
    } else {
      handle(req, res);
    }
  });

  server.listen(port, err => {
    if (err) throw err;
    logger.info(`> Ready on ${ROOT_URL}`);
  });
});

import express from "express";
import Chapter from "../models/Chapter";

const router = express.Router();

router.get("/get-chapter-detail", async (req, res) => {
  try {
    const { bookSlug, chapterSlug } = req.query;
    const chapter = await Chapter.getBySlug({
      bookSlug,
      chapterSlug,
      userId: req.user && req.user.id,
      isAdmin: req.user && req.user.isAdmin
    });
    res.json(chapter);
  } catch (err) {
    console.log(err);
    res.json({ error: err.message || err.toString() });
  }
});

export default router;

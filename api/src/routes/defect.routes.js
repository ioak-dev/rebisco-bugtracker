const express = require("express");
const router = express.Router();
const Defect = require("../models/Defect");
const Label = require("../models/Label");
const { auth } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

router.get("/", checkJwt, async (req, res) => {
  try {
    const defects = await Defect.find().sort({ createdAt: -1 });
    res.json(defects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", checkJwt, async (req, res) => {
  try {
    const defect = await Defect.findById(req.params.id);
    if (!defect) return res.status(404).json({ message: "Defect not found" });
    res.json(defect);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", checkJwt, async (req, res) => {
  const {
    raisedByTeam,
    description,
    activities,
    responsible,
    priority,
    dueDate,
    status,
    nextCheck,
    remark,
  } = req.body;

  const defect = new Defect({
    raisedByTeam,
    description,
    activities,
    responsible,
    priority,
    dueDate,
    status,
    nextCheck,
    remark,
    comments: [],
  });

  try {
    const newDefect = await defect.save();
    res.status(201).json(newDefect);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", checkJwt, async (req, res) => {
  try {
    const update = req.body;
    const updatedDefect = await Defect.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedDefect)
      return res.status(404).json({ message: "Defect not found" });

    res.json(updatedDefect);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", checkJwt, async (req, res) => {
  try {
    const deleted = await Defect.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Defect not found" });
    res.json({ message: "Defect deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/:id/comments", checkJwt, async (req, res) => {
  try {
    const newComment = req.body.comment;
    const defect = await Defect.findById(req.params.id);
    if (!defect) {
      return res.status(404).json({ message: "Defect not found" });
    }
    if (!defect.comments) {
      defect.comments = [];
    }
    defect.comments.push(newComment);
    await defect.save();
    res.status(200).json({ message: "comment added", comment: newComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id/comments/:commentId", checkJwt, async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const defect = await Defect.findById(id);
    if (!defect) return res.status(404).json({ message: "Defect not found" });
    defect.comments = defect.comments.filter((c) => c.id !== commentId);
    await defect.save();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.patch("/:id/comments/:commentId", checkJwt, async (req, res) => {
  try {
    const defect = await Defect.findById(req.params.id);
    if (!defect) {
      return res.status(404).json({ message: "Defect not found" });
    }
    const comment = defect.comments.find((c) => c.id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.content[0].text = req.body.text;
    comment.updated = new Date();
    await defect.save();
    res.status(200).json({ message: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/:id/comments", checkJwt, async (req, res) => {
  try {
    const defect = await Defect.findById(req.params.id);
    if (!defect) {
      return res.status(404).json({ message: "Defect not found" });
    }
    res.json(defect.comments || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/labels", checkJwt, async (req, res) => {
  try {
    const { label } = req.body;
    const { id } = req.params;

    let existing = await Label.findOne({ label });
    if (existing) {
      if (!existing.defects.includes(id)) {
        existing.defects.push(id);
        await existing.save();
      }
      return res.json({ message: "Label updated", label: existing });
    }
    const newLabel = new Label({
      label,
      defects: [id],
    });
    await newLabel.save();
    return res.status(200).json({ message: "Label added", label: newLabel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

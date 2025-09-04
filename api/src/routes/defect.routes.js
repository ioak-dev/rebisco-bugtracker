const express = require('express');
const router = express.Router();
const Defect = require('../models/Defect');
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

router.get('/', checkJwt, async (req, res) => {
  try {
    const defects = await Defect.find().sort({ createdAt: -1 });
    res.json(defects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', checkJwt, async (req, res) => {
  try {
    const defect = await Defect.findById(req.params.id);
    if (!defect) return res.status(404).json({ message: 'Defect not found' });
    res.json(defect);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', checkJwt, async (req, res) => {
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
  });

  try {
    const newDefect = await defect.save();
    res.status(201).json(newDefect);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', checkJwt, async (req, res) => {
  try {
    const update = req.body;
    const updatedDefect = await Defect.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedDefect) return res.status(404).json({ message: 'Defect not found' });

    res.json(updatedDefect);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const deleted = await Defect.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Defect not found' });
    res.json({ message: 'Defect deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

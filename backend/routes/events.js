const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// GET all events - public
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
});

// GET one event by id - public
router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
});

// POST add a new event - protected (admin action)
router.post("/", auth, async (req, res, next) => {
  try {
    const { name, category, fee, seats, date } = req.body;
    if (!name || !category || !seats) {
      return res.status(400).json({ message: "name, category and seats are required" });
    }
    const event = await Event.create({ name, category, fee, seats, date });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

// PUT edit an event - protected
router.put("/:id", auth, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
});

// DELETE remove an event - protected
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

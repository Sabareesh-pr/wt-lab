const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// POST register the logged-in user for an event - protected
router.post("/", auth, async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.seats <= 0) return res.status(400).json({ message: "No seats left" });

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId
    });

    event.seats -= 1;
    await event.save();

    res.status(201).json(registration);
  } catch (err) {
    next(err);
  }
});

// GET all registrations for the logged-in user - protected
router.get("/mine", auth, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id }).populate("event");
    res.status(200).json(registrations);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const {body, param} = require('express-validator');
const validate = require('../middleware/validate');
const fields = [body('name').isString().trim().isLength({min:1,max:120}), body('category').isIn(['Technical','Workshop','Cultural','Sports']), body('fee').isFloat({min:0}), body('seats').isInt({min:0}), body('date').optional().isISO8601(), validate];
const id = [param('id').isMongoId(), validate];
const auth = require("../middleware/auth");

// GET all events - public
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find().limit(100).lean();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
});

// GET one event by id - public
router.get("/:id", ...id, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
});

// POST add a new event - protected (admin action)
router.post("/", auth, auth.admin, ...fields, async (req, res, next) => {
  try {
    const { name, category, fee, seats, date } = req.body;
    if (!name || !category || seats === undefined) {
      return res.status(400).json({ message: "name, category and seats are required" });
    }
    const event = await Event.create({ name, category, fee, seats, date });
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

// PUT edit an event - protected
router.put("/:id", auth, auth.admin, ...id, ...fields, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, {name:req.body.name, category:req.body.category, fee:req.body.fee, seats:req.body.seats, date:req.body.date}, {
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
router.delete("/:id", auth, auth.admin, ...id, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

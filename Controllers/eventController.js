const EventService = require("../Services/eventService");

// Create
async function create(req, res) {
  try {
    const event = await EventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Read All
async function getAll(req, res) {
  try {
    const events = await EventService.getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Read One
async function getOne(req, res) {
  try {
    const event = await EventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update
async function update(req, res) {
  try {
    const event = await EventService.updateEvent(req.params.id, req.body);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete
async function remove(req, res) {
  try {
    await EventService.deleteEvent(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Block
async function block(req, res) {
  try {
    const event = await EventService.blockEvent(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Unblock
async function unblock(req, res) {
  try {
    const event = await EventService.unblockEvent(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Add Participant
async function addParticipant(req, res) {
  try {
    const event = await EventService.addParticipant(req.params.id, req.body);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Remove Participant
async function removeParticipant(req, res) {
  try {
    const event = await EventService.removeParticipant(req.params.id, req.body.name);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  block,
  unblock,
  addParticipant,
  removeParticipant,
};

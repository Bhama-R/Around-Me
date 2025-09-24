const EventService = require("../Services/eventService");
const { getParticipantsByEvent } = require("../Services/interestService");
// Create
async function create(req, res) {
  try {
    const event = await EventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all
async function getAll(req, res) {
  try {
    const events = await EventService.getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get one
async function getOne(req, res) {
  try {
    const event = await EventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// get attendee only
async function getEventParticipants(req, res) {
  try {
    const participants = await EventService.getEventParticipants(req.params.id);
    if (!participants.length) {
      return res.status(404).json({ message: "No participants found for this event" });
    }
    res.json(participants); // just participants
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
    // pass userId if you want authorization: req.user.id
    await EventService.deleteEvent(req.params.id /*, req.user.id */);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Block / Unblock
async function block(req, res) {
  try {
    const event = await EventService.blockEvent(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function unblock(req, res) {
  try {
    const event = await EventService.unblockEvent(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Add participant
async function addParticipant(req, res) {
  try {
    const participant = await EventService.applyForEvent(req.params.id, req.body);
    res.json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Remove participant
async function removeParticipant(req, res) {
  try {
    const event = await EventService.cancelParticipation(req.params.id, req.body.userId);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function fetchEventParticipants(req, res) {
  try {
    const { eventId } = req.params;
    const result = await getParticipantsByEvent(eventId);

    if (!result) {
      return res.status(404).json({ message: "No participants found for this event" });
    }

    res.json(result); // { event: {...}, participants: [...] }
  } catch (err) {
    console.error("fetchEventParticipants", err);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
}


module.exports = {
  create,
  getAll,
  getOne,
  getEventParticipants,
  update,
  remove,
  block,
  unblock,
  addParticipant,
  removeParticipant,
  fetchEventParticipants
};

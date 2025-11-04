const EventService = require("../Services/eventService");
const InterestService= require("../Services/interestService");
const Event = require("../Schema/eventSchema");


// Create
async function create(req, res) {
  try {

        const { image, attachments, ...rest } = req.body;

    const eventData = {
      ...rest,
      image: image || null,
      attachments: attachments || [],
    };

    const event = await EventService.createEvent(eventData);
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
async function getEventById(req, res) {
  try {
    const id = req.params.id;
    const event = await EventService.getEventById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

  async function fetchEventsByCategory (req, res)  {
  try {
    const data = await getEventsByCategory();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// get attendee only
async function getEventParticipants(req, res) {
  try {
    const eventId = req.params.id;
    const data = await EventService.getEventParticipants(eventId);

    // ✅ Always return empty array instead of 404
    res.json(data || { event: null, participants: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getEventsByCreator(req, res) {
  try {
    const userId = req.params.userId;
    const events = await EventService.getEventsWithParticipantsByUser(userId);
    res.status(200).json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
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
    console.log("🧩 Blocking event with ID:", id);
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

async function getMyCreatedEvents(req, res) {
  try {
    const { userId } = req.params;
    const events = await EventService.getEventsByCreator(userId);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch created events" });
  }
}

// ✅ Approve or Reject participant (interest)
async function updateInterestStatus(req, res) {
  try {
    const { eventId, participantId } = req.params;
    const { status } = req.body; // approved / rejected

    const updatedInterest = await InterestService.updateInterestStatus(participantId, status);

    if (!updatedInterest) {
      return res.status(404).json({ message: "Interest not found" });
    }

    res.json({ message: `Participant ${status} successfully`, updatedInterest });
  } catch (err) {
    console.error("updateInterestStatus:", err);
    res.status(500).json({ error: "Failed to update interest status" });
  }
}




module.exports = {
  create,
  getAll,
  getEventById,
  fetchEventsByCategory,
  getEventParticipants,
   getEventsByCreator,
  update,
  remove,
  block,
  unblock,
  addParticipant,
  removeParticipant,
  fetchEventParticipants,
  getMyCreatedEvents,
  updateInterestStatus
};

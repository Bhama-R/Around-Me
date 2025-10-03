const express = require("express");
const router = express.Router();
const multer = require("multer");
const EventController = require("../Controllers/eventController");
const {
  eventValidation,
  participantValidation,
  validationRes,
} = require("../middleware/Validation/validation");


router.post("/", eventValidation, validationRes, EventController.create);
router.get("/", EventController.getAll);
router.get("/:id", EventController.getOne);
router.put("/:id", eventValidation, validationRes, EventController.update);
router.delete("/:id", EventController.remove);
router.get("/:id/participants", EventController.getEventParticipants);

router.put("/:id/block", EventController.block);
router.put("/:id/unblock", EventController.unblock);


router.post("/:id/participants",participantValidation,validationRes,EventController.addParticipant);

router.delete("/:id/participants",participantValidation, validationRes,EventController.removeParticipant);


// // storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure /uploads folder exists in backend root
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Create event with image
// router.post("/event", upload.single("image"), async (req, res) => {
//   try {
//     const newEvent = new Event({
//       ...req.body,
//       image: req.file ? `/uploads/${req.file.filename}` : null,
//     });
//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;

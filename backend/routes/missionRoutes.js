const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
} = require("../controllers/missionController");

router.use(authMiddleware);

router.get("/", getMissions);
router.get("/:id", getMissionById);
router.post("/", createMission);
router.patch("/:id", updateMission);
router.delete("/:id", deleteMission);

module.exports = router;
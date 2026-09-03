const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
  generateMissionPdf,
} = require("../controllers/missionController");

router.use(authMiddleware);

router.get("/", getMissions);

// 必须放在 router.get("/:id") 前面
router.get("/:id/pdf", generateMissionPdf);

router.get("/:id", getMissionById);

router.post("/", createMission);

router.patch("/:id", updateMission);

router.delete("/:id", deleteMission);

module.exports = router;
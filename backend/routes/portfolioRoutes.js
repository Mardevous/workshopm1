const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/portfolioController");

router.use(authMiddleware);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getDashboard, updateConfiguration } = require("../controllers/dashboardController");

router.get("/", authMiddleware, getDashboard);
router.patch("/configuration", authMiddleware, updateConfiguration);

module.exports = router;
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

    
const missionRoutes = require("./routes/missionRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const documentRoutes = require("./routes/documentRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/missions", missionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/portfolio", portfolioRoutes);


// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "API Workshop M1 fonctionne !",
  });
});

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connecté");
  })
  .catch((error) => {
    console.error("Erreur MongoDB :", error);
  });



app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "demo@workshop.fr";
    const password = "Demo1234!";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Utilisateur déjà existant");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
    });

    console.log("Utilisateur créé");
    console.log("Email :", email);
    console.log("Mot de passe :", password);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createUser();
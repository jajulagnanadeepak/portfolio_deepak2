import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import projectRoutes from "./routes/projectRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// routes
app.use("/", authRoutes);
app.use("/api", contactRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/certifications", certificationRoutes);

// test
app.get("/", (req, res) => {
    res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
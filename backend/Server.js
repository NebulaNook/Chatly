import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import userRoutes from "./Routes/UserRoutes.js";
import messageRoutes from "./Routes/MessageRoutes.js";
import groupRoutes from "./Routes/GroupRoutes.js";
import authRoutes from "./Routes/AuthRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Create HTTP server to work with socket.io
const server = http.createServer(app);

// Initialize Socket.IO server with CORS options
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Frontend URL
    credentials: true,
  },
});

// Map to store connected users: userId → socketId
const users = new Map();

// Middleware to attach io instance to req for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Enable CORS with specified origin and credentials
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from "uploads" folder
app.use("/uploads", express.static(path.join("uploads")));

// Register API routes for users, messages, groups, and authentication
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/auth", authRoutes);

// Connect to MongoDB using connection string from environment variables
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  // Handle call initiation event
  socket.on("call-user", ({ to, offer }) => {
    io.to(to).emit("incoming-call", { from: socket.id, offer });
  });

  // Handle answering call event
  socket.on("answer-call", ({ to, answer }) => {
    io.to(to).emit("call-answered", { from: socket.id, answer });
  });

  // Handle ICE candidate exchange event
  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  // Register user when they connect with their userId
  socket.on("user-connected", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  // Handle sending one-to-one private messages
  socket.on("private-message", ({ to, message }) => {
    const receiverSocketId = users.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("private-message", message);
    }
  });

  // Handle joining a group chat room
  socket.on("join-room", (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // Handle sending group messages
  socket.on("group-message", async ({ groupId, message, sender }) => {
    try {
      // Import Message model dynamically
      const Message = (await import("./Models/Message.js")).default;
      // Save the message to the database
      await Message.create({
        sender,
        groupId,
        encryptedText: message,
        type: "text",
      });

      // Broadcast the message to other group members except sender
      socket.to(groupId).emit("group-message", {
        sender,
        groupId,
        encryptedText: message,
        type: "text",
      });
    } catch (err) {
      console.log("Error saving group message:", err.message);
    }
  });

  // Handle socket disconnection and cleanup
  socket.on("disconnect", () => {
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Start the server on specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

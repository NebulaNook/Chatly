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

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // change this in production to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Attach io to req so controllers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join("uploads")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Store connected users: userId → socketId
const users = new Map();

// Socket.IO logic
io.on("connection", (socket) => {
    // Call initiation
socket.on("call-user", ({ to, offer }) => {
  io.to(to).emit("incoming-call", { from: socket.id, offer });
});

// Call answer
socket.on("answer-call", ({ to, answer }) => {
  io.to(to).emit("call-answered", { from: socket.id, answer });
});

// ICE candidate exchange
socket.on("ice-candidate", ({ to, candidate }) => {
  io.to(to).emit("ice-candidate", { from: socket.id, candidate });
});
  console.log(" New socket connected:", socket.id);

  // Register user connection
  socket.on("user-connected", (userId) => {
    users.set(userId, socket.id);
    console.log(` User ${userId} connected with socket ${socket.id}`);
  });

  // One-to-one private message
  socket.on("private-message", ({ to, message }) => {
    const receiverSocketId = users.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("private-message", message);
    }
  });

  // Group: join room
  socket.on("join-room", (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // Group message broadcast
  socket.on("group-message", async ({ groupId, message, sender }) => {
    try {
      // Optionally store message in DB (example schema required)
      const Message = (await import("./Models/Message.js")).default;
      await Message.create({
        sender,
        groupId,
        encryptedText: message,
        type: "text",
      });

      // Emit to other users in the group
      socket.to(groupId).emit("group-message", {
        sender,
        groupId,
        encryptedText: message,
        type: "text",
      });
    } catch (err) {
      console.log(" Error saving group message:", err.message);
    }
  });

  // Disconnect cleanup
  socket.on("disconnect", () => {
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log(` User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

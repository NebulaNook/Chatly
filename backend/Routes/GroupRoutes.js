import express from "express";
import {
  createGroup,
  addMember,
  removeMember,
  getGroupMessages
} from "../Controllers/GroupController.js";
import { verifyToken } from "../Middleware/AuthMiddleware.js";
import upload from "../Middleware/Upload.js";

const router = express.Router();

router.post("/create", verifyToken, upload.single("avatar"), createGroup);
router.put("/:groupId/add", verifyToken, addMember);
router.put("/:groupId/remove", verifyToken, removeMember);
router.get("/:groupId/messages", verifyToken, getGroupMessages);


export default router;

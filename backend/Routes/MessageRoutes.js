import express from 'express';
import {
  sendMessage,
  getPrivateMessages,
  getGroupMessages
} from '../Controllers/MessageControllers.js';

const router = express.Router();

// POST /api/messages
router.post('/', sendMessage);

// GET /api/messages/private/:user1/:user2
router.get('/private/:user1/:user2', getPrivateMessages);

// GET /api/messages/group/:groupId
router.get('/group/:groupId', getGroupMessages);

export default router;

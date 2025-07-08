import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers); // Optional: get all users for chat

export default router;

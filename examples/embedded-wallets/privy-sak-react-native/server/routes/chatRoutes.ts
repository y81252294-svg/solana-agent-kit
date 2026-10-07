import express from 'express';
import { 
  getChatById, 
  getChatsByUserId, 
  saveChat, 
  deleteChat,
  bulkDeleteChats
} from '../controllers/chatController';
import { verifyWalletAddress, allowAuthenticatedOrCreateUser } from '../middleware/auth';

const router = express.Router();

// Chat routes - protected with authentication
router.get('/chat/:id', verifyWalletAddress, getChatById);
router.get('/chats', verifyWalletAddress, getChatsByUserId);
router.post('/chat', allowAuthenticatedOrCreateUser, saveChat);
router.delete('/chat/:id', verifyWalletAddress, deleteChat);
router.delete('/chats/bulk', verifyWalletAddress, bulkDeleteChats);

export default router; 
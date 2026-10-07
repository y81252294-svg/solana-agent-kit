import express from 'express';
import { 
  getMessagesByChatId, 
  getMessageById,
  saveMessages,
  deleteMessagesByChatIdAfterTimestamp
} from '../controllers/messageController';
import { verifyWalletAddress, allowAuthenticatedOrCreateUser } from '../middleware/auth';

const router = express.Router();

// Message routes - protected with authentication
router.get('/messages/:chatId', verifyWalletAddress, getMessagesByChatId);
router.get('/message/:id', verifyWalletAddress, getMessageById);
router.post('/messages', allowAuthenticatedOrCreateUser, saveMessages);
router.delete('/messages/:chatId/after', verifyWalletAddress, deleteMessagesByChatIdAfterTimestamp);

export default router; 
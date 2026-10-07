import express from 'express';
import { 
  createOrUpdateUser, 
  getUserByWalletAddress, 
  getCurrentUser 
} from '../controllers/userController';

const router = express.Router();

// User routes
router.post('/user', createOrUpdateUser);
router.get('/user/:walletAddress', getUserByWalletAddress);
router.get('/me', getCurrentUser);

export default router; 
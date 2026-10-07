import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to verify wallet address
export const verifyWalletAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get wallet address from header or query param
    const walletAddress = req.headers['x-wallet-address'] as string || req.query.walletAddress as string;

    if (!walletAddress) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Find user by wallet address
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Middleware to allow authenticated or create new user
export const allowAuthenticatedOrCreateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get wallet address from header or query param
    const walletAddress = req.headers['x-wallet-address'] as string || req.query.walletAddress as string;

    if (!walletAddress) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Find user by wallet address
    let user = await User.findOne({ walletAddress });

    // If user doesn't exist, create a new one
    if (!user) {
      try {
        user = new User({
          walletAddress,
          username: null,
          profilePicUrl: null
        });
        await user.save();
        console.log(`Created new user with wallet address: ${walletAddress}`);
      } catch (createError) {
        // Check if another process created the user in the meantime (race condition)
        user = await User.findOne({ walletAddress });
        if (!user) {
          console.error('Failed to create user:', createError);
          return res.status(500).json({ success: false, message: 'Failed to create user' });
        }
      }
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}; 
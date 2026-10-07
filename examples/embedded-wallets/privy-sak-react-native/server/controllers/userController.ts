import { Request, Response } from 'express';
import User from '../models/User';

// Create or update user
export const createOrUpdateUser = async (req: Request, res: Response) => {
  try {
    const { walletAddress, username, profilePicUrl } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address is required' });
    }
    
    // Check if user exists
    let user = await User.findOne({ walletAddress });
    
    if (user) {
      // Update existing user
      if (username) user.username = username;
      if (profilePicUrl) user.profilePicUrl = profilePicUrl;
      
      await user.save();
      return res.status(200).json({ 
        success: true, 
        message: 'User updated successfully',
        user
      });
    }
    
    // Create new user
    user = new User({
      walletAddress,
      username: username || null,
      profilePicUrl: profilePicUrl || null
    });
    
    await user.save();
    
    return res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user by wallet address
export const getUserByWalletAddress = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address is required' });
    }
    
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current user 
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Extract wallet address from authorization header or query parameter
    const walletAddress = req.headers['x-wallet-address'] as string || req.query.walletAddress as string;
    
    if (!walletAddress) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({ 
      success: true, 
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        profilePicUrl: user.profilePicUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}; 
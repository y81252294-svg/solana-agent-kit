import { Request, Response } from 'express';
import Chat from '../models/Chat';
import Message from '../models/Message';

// Get chat by ID
export const getChatById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findOne({ id });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    
    // Check if user is authorized to access this chat
    if (chat.userId !== req.user.walletAddress) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    return res.status(200).json({ success: true, data: chat });
  } catch (error) {
    console.error('Error fetching chat by ID:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get chats by user ID
export const getChatsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.user.walletAddress;
    const { limit = 10, startingAfter, endingBefore } = req.query;
    
    let query = Chat.find({ userId });
    
    // Handle pagination
    if (startingAfter) {
      const startCursor = await Chat.findOne({ id: startingAfter as string });
      if (startCursor) {
        // Create a query to find documents with createdAt greater than startCursor.createdAt
        query = query.where({ createdAt: { $gt: startCursor.createdAt } });
      }
    } else if (endingBefore) {
      const endCursor = await Chat.findOne({ id: endingBefore as string });
      if (endCursor) {
        // Create a query to find documents with createdAt less than endCursor.createdAt
        query = query.where({ createdAt: { $lt: endCursor.createdAt } });
      }
    }
    
    // Sort and limit
    const chats = await query
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .exec();
    
    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    console.error('Error fetching chats by user ID:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create or update chat
export const saveChat = async (req: Request, res: Response) => {
  try {
    const { id, title } = req.body;
    const userId = req.user.walletAddress;
    
    if (!id || !title) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID and title are required' 
      });
    }
    
    // Try to find existing chat
    const existingChat = await Chat.findOne({ id });
    
    if (existingChat) {
      // Check ownership
      if (existingChat.userId !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      
      // Update the existing chat
      existingChat.title = title;
      await existingChat.save();
      return res.status(200).json({ success: true, data: existingChat });
    }
    
    // Create a new chat
    const newChat = new Chat({
      id,
      title,
      userId,
    });
    
    await newChat.save();
    return res.status(201).json({ success: true, data: newChat });
  } catch (error) {
    console.error('Error saving chat:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete chat by ID
export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.walletAddress;
    
    // Check if chat exists
    const chat = await Chat.findOne({ id });
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    
    // Check ownership
    if (chat.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Delete the chat and its messages
    await Promise.all([
      Chat.deleteOne({ id }),
      Message.deleteMany({ chatId: id })
    ]);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Chat and associated messages deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bulk delete multiple chats
export const bulkDeleteChats = async (req: Request, res: Response) => {
  try {
    const { chatIds } = req.body;
    const userId = req.user.walletAddress;
    
    if (!chatIds || !Array.isArray(chatIds) || chatIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chat IDs array is required' 
      });
    }
    
    // Find all chats by IDs
    const chats = await Chat.find({ 
      id: { $in: chatIds },
      userId: userId  // Only find chats that belong to the user
    });
    
    if (chats.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No matching chats found' 
      });
    }
    
    // Extract IDs of the chats that were actually found and belong to the user
    const validChatIds = chats.map(chat => chat.id);
    
    // Delete the chats and their messages
    const [chatDeleteResult, messageDeleteResult] = await Promise.all([
      Chat.deleteMany({ id: { $in: validChatIds } }),
      Message.deleteMany({ chatId: { $in: validChatIds } })
    ]);
    
    return res.status(200).json({ 
      success: true, 
      message: `${chatDeleteResult.deletedCount} chats and their associated messages deleted successfully`,
      deletedChats: validChatIds
    });
  } catch (error) {
    console.error('Error bulk deleting chats:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete all chats for a user
export const deleteAllChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.walletAddress;
    
    // Find all chats belonging to the user
    const chats = await Chat.find({ userId });
    
    if (chats.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No chats found to delete',
        deletedCount: 0
      });
    }
    
    // Extract IDs of all user's chats
    const chatIds = chats.map(chat => chat.id);
    
    // Delete all chats and their messages
    const [chatDeleteResult, messageDeleteResult] = await Promise.all([
      Chat.deleteMany({ userId }),
      Message.deleteMany({ chatId: { $in: chatIds } })
    ]);
    
    return res.status(200).json({ 
      success: true, 
      message: `${chatDeleteResult.deletedCount} chats and their associated messages deleted successfully`,
      deletedCount: chatDeleteResult.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all chats:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}; 
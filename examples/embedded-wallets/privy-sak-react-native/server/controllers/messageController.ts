import { Request, Response } from 'express';
import Message from '../models/Message';
import Chat from '../models/Chat';

// Get messages by chat ID
export const getMessagesByChatId = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.walletAddress;
    
    if (!chatId) {
      return res.status(400).json({ success: false, message: 'Chat ID is required' });
    }
    
    // Verify the chat exists and belongs to the user
    const chat = await Chat.findOne({ id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    
    // Check ownership
    if (chat.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .exec();
    
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages by chat ID:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get message by ID
export const getMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.walletAddress;
    
    const message = await Message.findOne({ id });
    
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    // Verify the message's chat belongs to the user
    const chat = await Chat.findOne({ id: message.chatId });
    if (!chat || chat.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error('Error fetching message by ID:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Save messages
export const saveMessages = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    const userId = req.user.walletAddress;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Messages array is required' 
      });
    }
    
    const savedMessages = [];
    
    for (const messageData of messages) {
      const { id, chatId, role, parts, attachments } = messageData;
      
      // Validate required fields
      if (!id || !chatId || !role) {
        return res.status(400).json({
          success: false,
          message: 'Each message must have id, chatId, and role',
        });
      }
      
      // Verify chat exists and belongs to the user
      const chat = await Chat.findOne({ id: chatId });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: `Chat with ID ${chatId} not found`,
        });
      }
      
      // Check ownership
      if (chat.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Unauthorized: This chat does not belong to you' 
        });
      }
      
      // Validate and process parts to ensure they have valid text
      const processedParts = Array.isArray(parts) ? parts.map(part => {
        // If part.text is empty or undefined, set a fallback text
        if (!part.text || part.text.trim() === '') {
          console.warn(`Empty text found in message part, using fallback text`);
          return {
            ...part,
            text: 'Message content unavailable'
          };
        }
        return part;
      }) : [];
      
      // Ensure parts has at least one item with non-empty text
      if (processedParts.length === 0) {
        processedParts.push({
          type: 'text',
          text: 'Message content unavailable'
        });
      }
      
      // Check if message already exists
      const existingMessage = await Message.findOne({ id });
      
      if (existingMessage) {
        // Update existing message
        existingMessage.role = role;
        existingMessage.parts = processedParts;
        existingMessage.attachments = attachments || [];
        
        const updatedMessage = await existingMessage.save();
        savedMessages.push(updatedMessage);
      } else {
        // Create new message
        const newMessage = new Message({
          id,
          chatId,
          role,
          parts: processedParts,
          attachments: attachments || [],
        });
        
        const savedMessage = await newMessage.save();
        savedMessages.push(savedMessage);
      }
    }
    
    return res.status(201).json({ 
      success: true, 
      data: savedMessages 
    });
  } catch (error) {
    console.error('Error saving messages:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete messages by chat ID after timestamp
export const deleteMessagesByChatIdAfterTimestamp = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { timestamp } = req.body;
    const userId = req.user.walletAddress;
    
    if (!chatId || !timestamp) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID and timestamp are required',
      });
    }
    
    // Verify chat exists and belongs to the user
    const chat = await Chat.findOne({ id: chatId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }
    
    // Check ownership
    if (chat.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This chat does not belong to you',
      });
    }
    
    // Convert timestamp to Date if it's not already
    const date = new Date(timestamp);
    
    // Delete messages
    const result = await Message.deleteMany({
      chatId,
      createdAt: { $gte: date },
    });
    
    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} messages deleted`,
    });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}; 
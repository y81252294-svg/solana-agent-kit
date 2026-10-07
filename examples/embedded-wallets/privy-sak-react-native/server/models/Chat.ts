import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>('Chat', ChatSchema); 
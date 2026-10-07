import mongoose, { Document, Schema } from 'mongoose';

export interface IAttachment {
  url: string;
  name: string;
  contentType: string;
}

export interface IPart {
  type: string;
  text: string;
}

export interface IMessage extends Document {
  id: string;
  chatId: string;
  role: string;
  parts: IPart[];
  attachments: IAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const PartSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    chatId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant', 'system', 'tool'],
    },
    parts: [PartSchema],
    attachments: [AttachmentSchema],
  },
  { timestamps: true }
);

// Compound index for faster queries
MessageSchema.index({ chatId: 1, createdAt: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema); 
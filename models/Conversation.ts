import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Define the message structure
interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the message schema
const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Define the Conversation interface
export interface IConversation extends Document {
  title: string;
  userId: mongoose.Types.ObjectId | IUser;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Conversation schema
const ConversationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this conversation'],
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    messages: [MessageSchema]
  },
  {
    timestamps: true
  }
);

// Export the model
export default mongoose.models.Conversation || 
  mongoose.model<IConversation>('Conversation', ConversationSchema); 
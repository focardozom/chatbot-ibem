import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

// Helper function to get the user ID from cookies
async function getUserIdFromRequest(req: NextRequest) {
  const userSessionCookie = req.cookies.get('user_session');
  if (!userSessionCookie) return null;
  
  try {
    const sessionData = JSON.parse(userSessionCookie.value);
    if (!sessionData || !sessionData.userId) return null;
    
    await connectToDatabase();
    const user = await User.findById(sessionData.userId);
    if (!user) return null;
    
    return user._id;
  } catch (error) {
    console.error('Error getting user from session:', error);
    return null;
  }
}

// Save a new conversation
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { title, messages } = await req.json();
    
    if (!title || !messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid conversation data' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Format messages with timestamps
    const formattedMessages = messages.map(message => ({
      ...message,
      timestamp: message.timestamp || new Date()
    }));
    
    // Create a new conversation
    const conversation = await Conversation.create({
      title,
      userId,
      messages: formattedMessages
    });
    
    return NextResponse.json({
      success: true,
      conversationId: conversation._id,
      message: 'Conversation saved successfully'
    });
    
  } catch (error) {
    console.error('Save conversation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save conversation' },
      { status: 500 }
    );
  }
}

// Get all conversations for the current user
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    // Find all conversations for this user
    const conversations = await Conversation.find({ userId })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    
    return NextResponse.json({
      success: true,
      conversations
    });
    
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve conversations' },
      { status: 500 }
    );
  }
} 
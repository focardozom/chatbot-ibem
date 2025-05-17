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

// Get a specific conversation
export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const conversationId = params.id;
    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });
    
    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      conversation
    });
    
  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve conversation' },
      { status: 500 }
    );
  }
}

// Delete a conversation
export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const conversationId = params.id;
    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find and delete the conversation
    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId
    });
    
    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
} 
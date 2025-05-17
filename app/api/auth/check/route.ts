import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    // Get cookie from request
    const userSessionCookie = req.cookies.get('user_session');
    
    if (!userSessionCookie) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    try {
      // Parse the session data
      const sessionData = JSON.parse(userSessionCookie.value);
      
      if (!sessionData || !sessionData.userId) {
        return NextResponse.json(
          { success: false, message: 'Invalid session' },
          { status: 401 }
        );
      }
      
      // Connect to the database
      await connectToDatabase();
      
      // Find the user
      const user = await User.findById(sessionData.userId).select('-password');
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 401 }
        );
      }
      
      // Return user data
      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          isAdmin: user.isAdmin
        }
      });
      
    } catch (e) {
      // Invalid session format
      return NextResponse.json(
        { success: false, message: 'Invalid session format' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 
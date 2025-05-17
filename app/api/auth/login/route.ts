import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse the request body
    const { username, password } = await req.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide username and password' },
        { status: 400 }
      );
    }
    
    // Find the user by username
    const user = await User.findOne({ username }).select('+password');
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create a basic session
    const sessionData = {
      userId: user._id.toString(),
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin
    };
    
    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
    
    // Set the cookie in the response
    response.cookies.set({
      name: 'user_session',
      value: JSON.stringify(sessionData),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict'
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 
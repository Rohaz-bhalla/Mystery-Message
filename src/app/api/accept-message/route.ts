import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Debug logging
  console.log('Accept messages POST - User ID:', user._id, 'Session user:', !!session.user);

  if (!user._id) {
    return NextResponse.json(
      { success: false, message: 'User ID not found in session' },
      { status: 400 }
    );
  }

  try {
    const { acceptMessages } = await request.json();
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        isAcceptingMessages: updatedUser.isAcceptingMessages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Debug logging
  console.log('Accept messages GET - User ID:', user._id, 'Email:', user.email);

  if (!user._id) {
    return NextResponse.json(
      { success: false, message: 'User ID not found in session' },
      { status: 400 }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}
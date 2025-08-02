import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as { _id?: string; email?: string };

    // Debug logging
    console.log('Get messages - Session exists:', !!session);
    console.log('Get messages - User ID:', user?._id);
    console.log('Get messages - User email:', user?.email);

    if (!session || !user) {
      return NextResponse.json({ 
        success: false, 
        message: "Not authenticated - no session" 
      }, { status: 401 });
    }

    if (!user._id) {
      return NextResponse.json({ 
        success: false, 
        message: "Not authenticated - no user ID in session" 
      }, { status: 401 });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(user._id)) {
      console.error('Invalid ObjectId format:', user._id);
      return NextResponse.json({ 
        success: false, 
        message: "Invalid user ID format" 
      }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    console.log('Querying messages for user ID:', userId);

    const result = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    console.log('Aggregate result:', result.length > 0 ? 'User found' : 'No user found');

    const messages = result.length && result[0].messages ? result[0].messages.filter((msg: null) => msg !== null) : [];

    console.log('Messages count:', messages.length);

    return NextResponse.json({
      success: true,
      messages,
      message: messages.length ? undefined : "No messages",
    });

  } catch (error) {
    console.error('Error in get-message route:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}
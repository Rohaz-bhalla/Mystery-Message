import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const _user = session?.user as { _id?: string };

  if (!session || !_user?._id) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const userId = new mongoose.Types.ObjectId(_user._id);

  const result = await UserModel.aggregate([
    { $match: { _id: userId } },
    { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
    { $sort: { "messages.createdAt": -1 } },
    { $group: { _id: "$_id", messages: { $push: "$messages" } } },
  ]);

  const messages = result.length ? result[0].messages : [];

  return NextResponse.json({
    success: true,
    messages,
    message: messages.length ? undefined : "No messages",
  });
}

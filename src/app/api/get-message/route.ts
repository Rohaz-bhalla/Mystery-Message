import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from 'next-auth';
import mongoose from "mongoose";


export async function GET(request : NextRequest) {
    await dbConnect()

const session = await getServerSession(authOptions)
const _user = session?.user as User & { _id: string };

if(!session || !_user || !_user._id) {
    return NextResponse.json({
        success : false,
        message : 'Not authenticated'
    },{status : 400})    
}

const userId = new mongoose.Types.ObjectId(_user._id)

try {
    
    const user = await UserModel.aggregate([
        { $match : { _id : userId }},
        { $unwind : '$message' },
        { $sort : { 'message.createdAt' : -1 } },
        { $group : { _id : '$_id', message : {$push : '$message'} } }
    ]).exec();

    if(!user || user.length === 0){
        return NextResponse.json({
            success : false,
            message : 'User not found'
        },{status : 404})
    }

    return NextResponse.json({
            message : user[0].message
        },{status : 200})

} catch (error) {
    console.error('An unexpected error has occured',error)
    return NextResponse.json({
            success : false,
            message : 'Internal server error'
        },{status : 500})
}

}

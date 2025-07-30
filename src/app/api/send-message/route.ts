import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request : NextRequest){
    await dbConnect()

    const { username, content } = await request.json()

    try {

    const user = await UserModel.findOne({
            username
        }).exec()

        if(!user){
        return NextResponse.json({
            success : false,
            message : 'User not found'
        },{status : 404})
     }

     //check if user is accepting messages

     if(!user.isAcceptingMessages){
         return NextResponse.json({
            success : false,
            message : 'User not Accepting messages'
        },{status : 403})
     }

     const newMessage = { content, createdAt : new Date() }

     //push new message to the user's message array

     user.messages.push(newMessage as Message)
     await user.save()

      return NextResponse.json({
            success : true,
            message : 'Message sent succesfully'
        },{status : 201})
        
    } catch (error) {
        console.error('Error Adding Message',error)
        return NextResponse.json({
            success : false,
            message : 'Internal server error'
        },{status : 500})
    }
}
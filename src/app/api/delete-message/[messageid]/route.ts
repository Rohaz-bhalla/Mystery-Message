import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { Message } from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(request : NextRequest, 
    { params } : { params : { messageid : string } }
) {
    
    const messageId = params.messageid
    await dbConnect()
    const session = await getServerSession(authOptions)
    const _user : User = session?.user
    
    if(!session || !_user){
         return NextResponse.json({
            success : false,
            message : 'Not Authenticated'
        },{status : 500})
    }

    try {

        const updateResult = await UserModel.updateOne(
            { _id : _user._id },
            { $pull : { messages : { _id : messageId } } } 
        )
        

        if(updateResult.modifiedCount === 0){

        return NextResponse.json({
            success : false,
            message : 'Message not found or already detected'
        },{status : 404})

        }

         return NextResponse.json({
            success : true,
            message : 'message deleted'
        },{status : 500})

    } catch (error) {
        console.error('Error deleting message',error)
         return NextResponse.json({
            success : false,
            message : 'Error deleting message'
        },{status : 500})
    }
    
}
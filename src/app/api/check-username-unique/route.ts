import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { UsernameValidation } from "@/schemas/signUpSchema";
import { NextRequest,NextResponse } from "next/server";

const usernameQuerySchema = z.object({
    username : UsernameValidation,
})

export async function GET(request : NextRequest) {
    await dbConnect()

    try {

        const { searchParams } = new URL(request.url)
        const queryParams = {
            username : searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParams)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
        return NextResponse.json({
            success : false,
            message : usernameErrors?.length > 0 ? usernameErrors.join(',') : 'Invalid query parameters'
        },{status : 400})        
    }

    const { username } = result.data

    const existingVerifiedUser = await UserModel.findOne({
        username,
        isVerified : true
    })

    if(existingVerifiedUser){
        return NextResponse.json({
            success : false,
            message : 'Username is already taken'
        },{status : 200})
    }

    if(username.length === 0){
         return NextResponse.json({
            success : false,
            message : 'Username cannot be empty'
        },{status : 400})
    }

    return NextResponse.json({
            success : true,
            message : 'Username is Unique'
        },{status : 200})
        
    } catch (error) {
        console.log('Error checking username', error)
        return NextResponse.json({
                    success : false,
                    message : 'Error checking username'
                },{status : 500})
    }

}
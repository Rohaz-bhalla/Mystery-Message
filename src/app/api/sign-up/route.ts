import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request : NextRequest){
    await dbConnect()

    try {

        const{username, email, password} = await request.json()
        const existingUserVerificationByUsername = await UserModel.findOne({
            username,
            isVerified : true
        })

        if(existingUserVerificationByUsername){
            return NextResponse.json({
                success : false,
                message : 'username is already taken'
            },
            {
                status : 400
            })
        }

        const existingUserVerificationByEmail = await UserModel.findOne({
           email
        })

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if(existingUserVerificationByEmail){
           
            if(existingUserVerificationByEmail.isVerified){
                return NextResponse.json({
                    success : false,
                    message : 'User already exists with this email',
                },{
                    status : 400
                })
            }else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserVerificationByEmail.password = hashedPassword
                existingUserVerificationByEmail.verifyCode = verifyCode
                existingUserVerificationByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserVerificationByEmail.save(); 
            }
            
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

           const newUser =  new UserModel({
                    username,
                    email,
                    password : hashedPassword,
                    verifyCode,
                    verifyCodeExpiry : expiryDate,
                    isVerified : false,
                    isAcceptingMessages : true,
                    messages : []
            })

            await newUser.save()
        }

        const sendEmail =  await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if(!sendEmail.success){
            return NextResponse.json({
                success : false,
                message : sendEmail.message,
            },{
                status : 500
            })
        }

        return NextResponse.json({
            success : true,
            message : 'User registered succesfully. Please verify your account'
        },{
            status : 201
        })

    } catch (error) {
        console.log('error registering user', error)
        return NextResponse.json({
            success : false,
            message : 'error registering user'
        },
        {
         status : 500   
        }
    )
    }
}
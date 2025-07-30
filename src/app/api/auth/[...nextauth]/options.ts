/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt'

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "Credentials",
            credentials: {
      identifier: { label: "Email or Username", type: "text",},
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials : any): Promise<any>{
        await dbConnect();

        try {

            const user = await UserModel.findOne({
                $or : [
                    {email : credentials.identifier},
                    {username : credentials.identifier},
                ],
            })

            if(!user){
                throw new Error('No user Found with this email')
            }

            if(!user.isVerified){
                throw new Error ('User is not Verified!! Please verify Your account')
            }

            const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
            )

            if(isPasswordCorrect){
                return user;
            }else{
                throw new Error('Incorrect password')
            }
            
        } catch (error : any) {
            throw new Error(error || 'Login failed')
        }
    }
        })

],

// in documantation
    callbacks : {

        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString() // objectId ko string main convert krega
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
      return token
    },

         async session({ session, token }) {
        if(session.user && token){
            session.user._id = token._id;
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
        }
      return session
    },

},
    session : {
        strategy : 'jwt',
    },

    secret : process.env.NEXTAUTH_SECRET,
    pages : {
        signIn : '/sign-in',
    },
    

}


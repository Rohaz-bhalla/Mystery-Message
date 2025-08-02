/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  debug: true, // Add debug logging
  
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),

    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  
  callbacks: {
    async signIn({ account, user }) {
      console.log('SignIn callback triggered:', { account: account?.provider, userEmail: user?.email });
      
      try {
        await dbConnect();

        if (account?.provider === 'github') {
          console.log('Processing GitHub OAuth for:', user?.email);
          
          const existingUser = await UserModel.findOne({ email: user.email });

          if (existingUser) {
            console.log('Existing user found, updating verification status');
            if (!existingUser.isVerified) {
              existingUser.isVerified = true;
              await existingUser.save();
              console.log('User verification status updated');
            }
          } else {
            console.log('Creating new user for GitHub OAuth');
            const newUser = await UserModel.create({
              email: user.email,
              username: user.name?.replace(/\s/g, '').toLowerCase() || user.email?.split('@')[0],
              isVerified: true,
              isAcceptingMessages: true,
            });
            console.log('New user created:', newUser._id);
          }
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        // For GitHub users, we need to get the user data from database
        if (account?.provider === 'github' || (!user._id && user.email)) {
          try {
            await dbConnect();
            const dbUser = await UserModel.findOne({ email: user.email });
            if (dbUser) {
              token._id = dbUser._id?.toString();
              token.isVerified = dbUser.isVerified;
              token.isAcceptingMessages = dbUser.isAcceptingMessages;
              token.username = dbUser.username;
              console.log('JWT: GitHub user data loaded from DB:', { 
                id: token._id, 
                username: token.username 
              });
            } else {
              console.error('JWT: GitHub user not found in database:', user.email);
            }
          } catch (error) {
            console.error('Error fetching user in JWT callback:', error);
          }
        } else {
          // For credential users
          token._id = user._id?.toString();
          token.isVerified = user.isVerified;
          token.isAcceptingMessages = user.isAcceptingMessages;
          token.username = user.username;
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  
  session: {
    strategy: 'jwt',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  pages: {
    signIn: '/sign-in',
  },
};
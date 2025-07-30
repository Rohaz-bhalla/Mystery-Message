import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions) // documentation main hai

export { handler as GET, handler as POST };
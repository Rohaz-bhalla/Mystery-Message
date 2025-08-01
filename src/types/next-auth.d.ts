import { DefaultSession } from "next-auth";

// ✅ Extending `Session.user`
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      _id?: string;
      isVerified: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    };
  }

  interface User {
    _id?: string;
    isVerified: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

// ✅ Extending `JWT`
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

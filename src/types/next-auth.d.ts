import 'next-auth'

declare module 'next-auth'{
    interface Session{
        user : {
            _id? : string;
            isVerified : boolean;
            isAcceptingMessages? : boolean;
            username? : string;
        }
        & DefaultSession['user'] // guide in adapters in documentation
    }

    interface User {
         _id? : string;
            isVerified : boolean;
            isAcceptingMessages? : boolean;
            username? : string;
    }
}


// another way of writing
declare module 'next-auth/jwt'{
    interface JWT {
          _id? : string;
            isVerified : boolean;
            isAcceptingMessages? : boolean;
            username? : string;
    }
}
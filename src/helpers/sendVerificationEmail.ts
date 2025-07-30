import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'
import { ApiResponse } from '@/types/apiResponse'

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string 
) : Promise<ApiResponse>{

    try {

        await resend.emails.send({
        from: 'Rohaz-Codes <website@resend.dev>',
        to: email,
        subject: 'Verification code',
        react: VerificationEmail({username, otp : verifyCode }),
    });
    
    return {success : true, message: 'Verification email sent succesfully', messages: []}

        
    } catch (errorEmail) {
        console.error('error sending verification email' , errorEmail)
        return {success : false, message: 'failed to send verification email', messages: []}
    }

}
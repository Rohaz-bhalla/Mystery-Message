'use client'

import { ApiResponse } from "@/types/apiResponse"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SignUpSchema } from "@/schemas/signUpSchema"
import { useForm } from "react-hook-form"
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function SignUpForm() { 
    const [ username, setUsername ] = useState('')
    const [ usernameMessage , setUsernameMessage ] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername,500)

    const router = useRouter()

    const form = useForm< z.infer<typeof SignUpSchema> >({
        resolver : zodResolver(SignUpSchema),
        defaultValues : {
            username : '',
            email : '',
            password : '',
        }
    })

    useEffect(() => {
        
        const checkUsernameUnique = async () => {
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('') //will reset it
            
                try {
                    
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message?? 'Error checking username')
                    
                }finally{
                    setIsCheckingUsername(false)
                }

            }
        }
        checkUsernameUnique()
    },[username])

    const onSubmit = async (data : z.infer<typeof SignUpSchema>) => {

    setIsSubmitting(true)

    try {
      const response = await axios.post('/api/sign-up',data)
      
      toast.success('Sign-up Successfull'+ (response.data.message ?? ''))

      setTimeout(()=>{
        router.replace(`/verify/${username}`)
      },1500)

        setIsSubmitting(false)

    } catch (error) {
        console.error('Error during sign-up :', error)

        const axiosError = error as AxiosError<ApiResponse>

        //Setting up a default message

        const errorMessage =axiosError.response?.data.message??
        ('There was a problem with your sign-up. Please try again later.')

        toast.error('Sign-up Failed' + errorMessage)

        setIsSubmitting(false)
        
    }
    
 }

 return(
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-600">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Join Now !!
                </h1>

                 <p className="mb-4">Sign-up to start your adventure</p>

            </div>

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Input {...field} 
                onChange={(e) => {
                field.onChange(e)
                debounced(e.target.value)
              }} />
                
              {isCheckingUsername && <Loader2 className="animate-spin" />}
              {!isCheckingUsername && usernameMessage && (
                <p className={`text-sm ${usernameMessage === 'Username is Unique'?'text-green-500' :'text-red-500'}`}>The {usernameMessage}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

           <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className=' text-black text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
        
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>

            <br></br>
            <Button
               type="button"
               variant="outline"
               className="w-full"
               onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
             >
               Continue with GitHub
             </Button>
      </form>
    </Form>

    <div className="text-center mt-4">
      <p>Already a member? {''}
      <Link href={"/sign-in"} className="text-blue-400 hover:text-blue-600">
      Sign In
      </Link>
      </p>
    </div>

        </div>

    </div>
    </>
 )

}


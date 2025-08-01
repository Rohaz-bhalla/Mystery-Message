'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SignInSchema } from "@/schemas/signInSchema"
import { useForm } from "react-hook-form"


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

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Login failed');
      } else {
        toast.success('Error');
      }
    }

    if (result?.url) {
      toast.success('Login Succesfull')

      setTimeout(()=>{
        router.replace('/dashboard');
      })
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl mb-6">
            Welcome Back to Mysterious-Message
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
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
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit">Sign In</Button>
            <br></br>
            <hr></hr>
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
                {/* <Button onClick={() => toast('My first toast')}>hlo</Button> */}

          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
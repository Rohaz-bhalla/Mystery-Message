'use client'

import React from 'react'
import { ApiResponse } from "@/types/apiResponse"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from "react-hook-form"
import axios, { AxiosError } from 'axios'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { verifySchema } from '@/schemas/verifySchema'

export default function VerifyUser() {

    const router = useRouter()
    const params = useParams<{ username : string }>()
    const form = useForm< z.infer<typeof verifySchema> >({
        resolver : zodResolver(verifySchema)
    })

    const onSubmit = async (data : z.infer<typeof verifySchema>) => {

        try {

            const response = await axios.post<ApiResponse>(`/api/verify-code`,{
                username : params.username,
                code : data.code
            })

            toast.success('Success' + response.data.message)

            router.replace('sign-in')
            
        } catch (error) {
            const axiosError = error as AxiosError <ApiResponse>
            toast.error('Verification failed' + axiosError.response?.data.message)
        }

    }

    return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-600">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                   Verify your account
                </h1>

                 <p className="mb-4">Enter the verification code sent to your email</p>

            </div>

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <Input {...field}/>
              <FormMessage />
            </FormItem>
          )}
        />     
            <Button type="submit" className='w-full'> Verify </Button>
      </form>
    </Form>
        </div>
    </div>
    </>
  )
}

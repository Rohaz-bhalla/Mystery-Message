'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessagesSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type acceptMessageInput = z.infer<typeof AcceptMessageSchema>

function UserDashboard() {

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')
  const [profileUrl, setProfileUrl] = useState('')

  const handleDeleteMessage = (messageId : string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const {data : session } = useSession()

  const form = useForm<acceptMessageInput>({
    resolver : zodResolver(AcceptMessageSchema),
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessage')

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitching(true)

    try {
      const response = await axios.get<ApiResponse>('/api/accept-message')
      setValue('acceptMessage', response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Failed to fetch message settings' + (axiosError.response?.data?.message ?? ''))

    }finally{
      setIsSwitching(false)
    }

  },[setValue, toast])

  const fetchMessages = useCallback(async ( refresh : boolean = false ) => {

    setIsLoading(true)
    setIsSwitching(false)

    try {
      
      const response = await axios.get<ApiResponse>('/api/get-message')
      setMessages( response.data.messages || [])

      if(refresh){
        toast.info('Refreshed messages' + 'Showing latest messages')
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error(' Failed to fetch messages' + (axiosError.response?.data.message ?? + ''))
      
    }finally{
      setIsLoading(false)
      setIsSwitching(false)
    }

  },[setIsLoading, setMessages, toast])

  useEffect(() => {

    if(session?.user){
      fetchMessages()
      fetchAcceptMessages()
    }
  },[session, setValue, toast, fetchAcceptMessages, fetchMessages])

const handleSwitchChange = async () => {
  try {
    const response = await axios.post<ApiResponse>('/api/accept-message', {
      acceptMessages : !acceptMessages,
    })
    setValue('acceptMessage', !acceptMessages)
    toast.info(response.data.message + '') 
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast.error('Failed to update message settings' + axiosError.response?.data.message)
  }

  // if(!session?.user){
  //   toast.error('Please Login !!')
  //   return
  // }
}


   const username = session?.user?.username

  useEffect(() => {
    if (typeof window !== 'undefined' && username) {
      const currentBaseUrl = `${window.location.protocol}//${window.location.host}`
      setBaseUrl(currentBaseUrl)
      setProfileUrl(`${currentBaseUrl}/u/${username}`)
    }
  }, [username])

  const copyToClipboard = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl)
      toast.success("Copied to clipboard")
    }
  }


  return (
  <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-10">
  <div className="max-w-6xl mx-auto bg-[#1a1a1a] border border-[#2c2c2c] rounded-xl p-6 md:p-10 shadow-xl">

    {/* Title */}
    <h1 className="text-3xl md:text-4xl font-bold mb-6">Welcome, {username}</h1>

    {/* Profile Link */}
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Your Unique Message Link</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={profileUrl}
          disabled
          className="bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-400 w-full"
        />
        <Button
          onClick={copyToClipboard}
          className="bg-purple-600 hover:bg-purple-700 transition text-white"
        >
          Copy Link
        </Button>
      </div>
    </div>

    {/* Switch */}
    <div className="mb-6 flex items-center">
      <Switch
        {...register('acceptMessage')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitching}
      />
      <span className="ml-3 text-gray-300">
        Accept Messages: {acceptMessages ? 'On' : 'Off'}
      </span>
    </div>

    <Separator className="my-8 bg-gray-700" />

    {/* Refresh Button */}
    <div className="mb-6 flex justify-end">
      <Button
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
        variant="secondary"
        className="bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
    </div>

    {/* Messages Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message) => (
          <MessageCard
            key={String(message._id)}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <div className="text-center text-gray-400">No messages to display.</div>
      )}
    </div>
  </div>
</div>

  )
}

export default UserDashboard
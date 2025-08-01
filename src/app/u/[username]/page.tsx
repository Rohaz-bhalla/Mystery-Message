'use client'

import { MessageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';

import Link from 'next/link';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestedMessages, setSuggestedMessages] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to send message'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestError(null);
    
    try {
      const response = await axios.post('/api/suggest-messages');
      setSuggestedMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setSuggestError('Failed to load suggestions');
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-10">
  <div className="max-w-2xl mx-auto bg-[#1a1a1a] border border-[#2c2c2c] rounded-2xl shadow-md p-6 md:p-8">
    
    {/* Title */}
    <h1 className="text-3xl font-bold text-center mb-6">
      Send a Message to <span className="text-purple-400">@{username}</span>
    </h1>

    {/* Form */}
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-300">Your Message</FormLabel>
              <FormControl>
                <Input
                  placeholder="Type your anonymous message..."
                  className="bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-400 focus:ring-purple-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading || !messageContent}
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </div>
      </form>
    </Form>

    {/* Suggest Messages */}
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Suggested Messages</h2>
        <Button
          size="sm"
          variant="secondary"
          className="bg-gray-700 hover:bg-gray-600 text-white"
          onClick={fetchSuggestedMessages}
          disabled={isSuggestLoading}
        >
          {isSuggestLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {suggestError ? (
          <p className="text-red-500">{suggestError}</p>
        ) : (
          parseStringMessages(suggestedMessages).map((msg, i) => (
            <button
              key={i}
              onClick={() => handleMessageClick(msg)}
              className="w-full text-left bg-[#2a2a2a] hover:bg-[#333] transition px-4 py-3 rounded-md text-sm border border-[#3a3a3a]"
            >
              {msg}
            </button>
          ))
        )}
      </div>
    </div>

    {/* Divider */}
    <div className="my-8 border-t border-[#333]" />

    {/* CTA */}
    <div className="text-center space-y-2">
      <p className="text-sm text-gray-400">Want to receive anonymous messages?</p>
      <Link href="/sign-up">
        <Button className="bg-white text-black hover:scale-105 transition px-6 py-3 font-semibold">
          Create Your Account
        </Button>
      </Link>
    </div>
  </div>
</div>

  );
}
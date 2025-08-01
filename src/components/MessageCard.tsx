'use client'

import React from 'react'
import dayjs from 'dayjs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Message } from '@/model/User'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { toast } from 'sonner'

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

function MessageCard({ message, onMessageDelete }: MessageCardProps) {

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      toast.success('The message was successfully deleted: ' + response.data.message);
      onMessageDelete(String(message._id));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error deleting message: ' + axiosError.response?.data.message);
    }
  }

  return (
    <Card className="w-full p-4">
      <CardHeader className="p-0 mb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">
            Message
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <p className="text-sm break-words whitespace-pre-line">
          {message.content}
        </p>
      </CardContent>
    </Card>
  )
}

export default MessageCard;

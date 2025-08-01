'use client'

import React from 'react'
import carouselData from '@/carouselData.json'
import { Mail } from 'lucide-react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 md:px-24 py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
          Who wants to message you? <br className="hidden md:block" /> Nobody knows!
        </h1>
        <p className="text-lg md:text-2xl font-medium max-w-2xl">
          Dive into the world of anonymous messages. Send and receive messages—your identity remains a secret.
        </p>
      {/* Spacing */}
      <div className="py-10"/>

      {/* Carousel Section */}
      <div className="flex justify-center px-4">
        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          opts={{ align: 'start' }}
          orientation="vertical"
          className="w-full max-w-lg"
        >
          <CarouselContent className="h-[240px]">
            {carouselData.map((item, index) => (
              <CarouselItem key={index} className="p-2">
                <Card className="bg-white text-gray-900 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start gap-4">
                    <Mail className="mt-1 text-gray-600" />
                    <div>
                      <p className="mb-1">{item.content}</p>
                      <p className="text-xs text-gray-500">{item.received}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-white text-gray-800 hover:bg-gray-200" />
          <CarouselNext className="bg-white text-gray-800 hover:bg-gray-200" />
        </Carousel>
      </div>

      <div className="mt-20 flex justify-center px-4">
       <div className="bg-gray-100 text-gray-800 rounded-xl shadow-md p-6 md:p-10 w-full max-w-3xl">
         <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How to Use</h2>
         <ol className="space-y-4 list-decimal list-inside text-left text-lg font-medium">
           <li>Copy your personal anonymous link from your dashboard.</li>
           <li>Share it with friends on social media, WhatsApp, or anywhere.</li>
           <li>They can send you messages without revealing who they are.</li>
           <li>Visit your dashboard to read them. That’s it — no sign-in needed from them!</li>
         </ol>
       </div>
     </div>

    {/* Call-to-Action Button */}
       <div className="flex justify-center mt-10">
         <Link href="/sign-up">
           <Button className="text-lg px-6 py-4 shadow-md hover:scale-105 transition-transform duration-200">
             🚀 Get Started
           </Button>
         </Link>
       </div>

      </div>

       {/* Footer */}
       <footer className=" text-center p-6 bg-gray-950 text-gray-300 text-sm">
         © 2025 <span className="font-semibold text-white">Mysterious Message</span>. All rights reserved. <br />
         Made with ❤️ by Rohaz Bhalla 😁
       </footer>
    </>
  )
}

export default HomePage

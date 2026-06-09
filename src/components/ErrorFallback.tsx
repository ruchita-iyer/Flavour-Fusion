'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import RateLimitDialog from './RateLimitDialog';

interface ErrorFallbackProps {
  isRateLimit: boolean;
  errorType?: 'rate-limit' | 'unavailable';
  recipeName: string;
}

export default function ErrorFallback({ isRateLimit, errorType = 'rate-limit', recipeName }: ErrorFallbackProps) {
  const [isRateLimitOpen, setIsRateLimitOpen] = useState(isRateLimit);
  const isUnavailable = errorType === 'unavailable';

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to recipes
            </Button>
          </Link>
        </div>
        <Card className="overflow-hidden shadow-xl border-amber-500/20 max-w-2xl mx-auto bg-background/95">
          <CardHeader className="p-8 text-center flex flex-col items-center">
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full mb-4 border border-amber-500/20">
              <AlertTriangle className="h-8 w-8 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold font-headline mb-2 text-foreground">
              {isRateLimit 
                ? (isUnavailable ? "AI Service Unavailable" : "AI Service Busy") 
                : "Failed to load recipe"}
            </CardTitle>
            <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm leading-relaxed">
              {isRateLimit 
                ? (isUnavailable 
                    ? `We couldn't retrieve the ingredients and instructions for "${recipeName}" because the AI service is currently down (503 Service Unavailable).`
                    : `We couldn't retrieve the ingredients and instructions for "${recipeName}" because the AI service is currently at its usage limit. Please wait a moment and try again.`)
                : `An unexpected error occurred while loading details for "${recipeName}". Please check your connection and try again.`
              }
            </p>
            <div className="flex gap-4 w-full sm:w-auto justify-center">
              <Link href="/" className="w-1/2 sm:w-auto">
                <Button variant="outline" className="w-full">
                  Go Home
                </Button>
              </Link>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-1/2 sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-md hover:shadow-amber-500/10"
              >
                Retry
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
      <RateLimitDialog open={isRateLimitOpen} onOpenChange={setIsRateLimitOpen} errorType={errorType} />
    </div>
  );
}

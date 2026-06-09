'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZapOff, Clock, AlertTriangle } from 'lucide-react';

interface RateLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorType?: 'rate-limit' | 'unavailable';
}

export default function RateLimitDialog({ open, onOpenChange, errorType = 'rate-limit' }: RateLimitDialogProps) {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!open) return;
    
    // Reset timer when dialog opens
    setSecondsLeft(60);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  const progressPercentage = (secondsLeft / 60) * 100;
  const isUnavailable = errorType === 'unavailable';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] overflow-hidden rounded-2xl border border-amber-500/20 bg-background/95 backdrop-blur-md shadow-2xl transition-all duration-300">
        
        {/* Glow decorative background */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4 relative z-10">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
            {isUnavailable ? <AlertTriangle className="h-8 w-8" /> : <ZapOff className="h-8 w-8" />}
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
              !
            </div>
          </div>
          
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-bold font-headline tracking-tight text-foreground">
              {isUnavailable ? 'AI Service Unavailable' : 'AI Rate Limit Reached'}
            </DialogTitle>
            <DialogDescription className="text-amber-500/80 font-medium text-xs flex items-center justify-center gap-1.5 mt-1">
              <Clock className="h-3.5 w-3.5" />
              {isUnavailable ? "Chef's kitchen is temporarily offline" : "Chef is catching their breath"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4 text-center relative z-10 px-2">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isUnavailable 
              ? "The AI service is currently unavailable or returning an error (503 Service Unavailable). Please wait a brief moment and retry. The provider may be experiencing a temporary outage."
              : "Our AI chef is currently whipping up suggestions for many foodies. We've reached the temporary request limit. Please take a brief pause and try again."
            }
          </p>

          {/* Progress bar container */}
          <div className="space-y-2 max-w-sm mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{isUnavailable ? 'Retrying in...' : 'Cooling down...'}</span>
              <span className="font-mono font-semibold text-foreground">{secondsLeft}s remaining</span>
            </div>
            
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-muted/50">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center border-t border-border/55 pt-4 mt-2 relative z-10">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-8 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            {secondsLeft === 0 ? 'Try Again Now' : 'Got It'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

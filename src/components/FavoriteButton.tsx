// src/components/FavoriteButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { toggleFavoriteRecipe } from '@/app/actions';
import { cn } from '@/lib/utils';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  recipeName: string;
  recipeSlug: string;
  isInitiallyFavorite: boolean;
}

export function FavoriteButton({ recipeName, recipeSlug, isInitiallyFavorite }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You must be logged in to save favorite recipes.',
      });
      return;
    }

    startTransition(async () => {
      const result = await toggleFavoriteRecipe(user.uid, recipeName, recipeSlug);
      if (result.success) {
        setIsFavorite(result.isFavorite);
        toast({
          title: result.isFavorite ? 'Recipe Saved!' : 'Recipe Unsaved',
          description: `${recipeName} has been ${result.isFavorite ? 'added to' : 'removed from'} your favorites.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleFavorite}
      disabled={isPending}
      aria-label="Save to favorites"
    >
      <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
    </Button>
  );
}

'use client';

import { useActionState, useFormStatus } from 'react-dom';
import { getRecipeSuggestions } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import RecipeList from './RecipeList';

const initialState = {
  message: null,
  recipes: [],
  error: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Suggesting...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Suggest Recipes
        </>
      )}
    </Button>
  );
}

export default function RecipeGenerator() {
  const [state, formAction] = React.useActionState(getRecipeSuggestions, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.error) {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: state.message,
      });
    }
    if (state.recipes && state.recipes.length > 0 && !state.error) {
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div>
        <Card className="max-w-3xl mx-auto shadow-lg">
            <CardContent className="p-6 md:p-8">
                <form ref={formRef} action={formAction} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input
                    name="ingredients"
                    placeholder="e.g., chicken, broccoli, garlic"
                    required
                    className="flex-grow text-base"
                    />
                    <SubmitButton />
                </div>
                </form>
            </CardContent>
        </Card>
        <RecipeList recipes={state.recipes || []} />
    </div>
  );
}

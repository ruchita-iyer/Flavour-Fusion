'use server';

import { suggestRecipes, SuggestRecipesInput, SuggestRecipesOutput } from '@/ai/flows/suggest-recipes';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  ingredients: z.string().min(3, 'Please enter at least one ingredient.'),
});

interface RecipeSuggestionState {
  message?: string | null;
  recipes?: string[];
  error?: boolean;
}

export async function getRecipeSuggestions(prevState: RecipeSuggestionState, formData: FormData): Promise<RecipeSuggestionState> {
  const validatedFields = FormSchema.safeParse({
    ingredients: formData.get('ingredients'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.ingredients?.[0] || 'Invalid input.',
      error: true,
    };
  }

  try {
    const input: SuggestRecipesInput = {
      ingredients: validatedFields.data.ingredients,
    };

    const result: SuggestRecipesOutput = await suggestRecipes(input);
    
    if (result.recipes && result.recipes.length > 0) {
      if (result.recipes[0].toLowerCase().includes("provide more ingredients")) {
        return { message: result.recipes[0], recipes: [], error: true };
      }
      return { message: 'Here are your recipe suggestions!', recipes: result.recipes, error: false };
    } else {
      return { message: 'Could not find any recipes. Try different ingredients.', recipes: [], error: true };
    }
  } catch (e) {
    console.error(e);
    return { message: 'An unexpected error occurred. Please try again.', error: true };
  }
}

'use server';

/**
 * @fileOverview AI flow for getting recipe details.
 *
 * - getRecipeDetails - A function that returns the ingredients and instructions for a given recipe.
 * - RecipeDetailsInput - The input type for the getRecipeDetails function.
 * - RecipeDetailsOutput - The return type for the getRecipeDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeDetailsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to get details for.'),
});
export type RecipeDetailsInput = z.infer<typeof RecipeDetailsInputSchema>;

const RecipeDetailsOutputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of ingredients for the recipe.'),
  instructions: z.array(z.string()).describe('A list of instructions for preparing the recipe.'),
});
export type RecipeDetailsOutput = z.infer<typeof RecipeDetailsOutputSchema>;

export async function getRecipeDetails(input: RecipeDetailsInput): Promise<RecipeDetailsOutput> {
  return getRecipeDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRecipeDetailsPrompt',
  input: {schema: RecipeDetailsInputSchema},
  output: {schema: RecipeDetailsOutputSchema},
  prompt: `You are an expert chef. A user wants to know how to make a "{{recipeName}}". Provide a list of ingredients and step-by-step instructions for this recipe.`,
});

const getRecipeDetailsFlow = ai.defineFlow(
  {
    name: 'getRecipeDetailsFlow',
    inputSchema: RecipeDetailsInputSchema,
    outputSchema: RecipeDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
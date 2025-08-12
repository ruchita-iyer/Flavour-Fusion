'use server';

import { suggestRecipes, SuggestRecipesInput, SuggestRecipesOutput } from '@/ai/flows/suggest-recipes';
import { z } from 'zod';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
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

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

interface AuthState {
  message?: string | null;
  error?: boolean;
  success?: boolean;
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      message: errors.email?.[0] || errors.password?.[0] || 'Invalid input.',
      error: true,
    };
  }

  try {
    await signInWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
    return { message: 'Logged in successfully!', success: true };
  } catch (e: any) {
    return { message: e.message, error: true };
  }
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      message: errors.email?.[0] || errors.password?.[0] || 'Invalid input.',
      error: true,
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, validatedFields.data.email, validatedFields.data.password);
    // Create a user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        favoriteRecipes: []
    });
    return { message: 'Signed up successfully!', success: true };
  } catch (e: any) {
    return { message: e.message, error: true };
  }
}

export async function toggleFavoriteRecipe(userId: string, recipeName: string, recipeSlug: string) {
  const userDocRef = doc(db, 'users', userId);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const isFavorite = userData.favoriteRecipes.some((r: any) => r.slug === recipeSlug);

      if (isFavorite) {
        // Remove from favorites
        await updateDoc(userDocRef, {
          favoriteRecipes: arrayRemove({ name: recipeName, slug: recipeSlug })
        });
      } else {
        // Add to favorites
        await updateDoc(userDocRef, {
          favoriteRecipes: arrayUnion({ name: recipeName, slug: recipeSlug })
        });
      }
      revalidatePath(`/recipes/${recipeSlug}`);
      revalidatePath('/my-recipes');
      return { success: true, isFavorite: !isFavorite };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error toggling favorite recipe:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getUserFavoriteRecipes(userId: string): Promise<{name: string, slug: string}[]> {
  const userDocRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data().favoriteRecipes || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    return [];
  }
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserFavoriteRecipes } from '@/app/actions';
import RecipeCard from '@/components/RecipeCard';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyRecipesPage() {
  const { user, loading } = useAuth();
  const [favoriteRecipes, setFavoriteRecipes] = useState<{name: string, slug: string}[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    if (user) {
      getUserFavoriteRecipes(user.uid).then(setFavoriteRecipes);
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-block bg-primary/10 p-3 rounded-lg mb-4">
           <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
          My Favorite Recipes
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Here are all the delicious recipes you've saved.
        </p>
      </div>
      
      <div className="mt-12">
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe, index) => (
              <RecipeCard key={index} recipeName={recipe.name} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">You haven't saved any favorite recipes yet.</p>
        )}
      </div>
    </div>
  );
}

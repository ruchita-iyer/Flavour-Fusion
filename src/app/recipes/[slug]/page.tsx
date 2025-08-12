import { getRecipeDetails } from '@/ai/flows/get-recipe-details';
import { generateRecipeImage } from '@/ai/flows/generate-recipe-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChefHat } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

function unslugify(slug: string) {
    const words = slug.split('-');
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function RecipeImage({ recipeName }: { recipeName: string }) {
  const { imageUrl } = await generateRecipeImage({ recipeName });
  return (
    <Image
      src={imageUrl}
      alt={recipeName}
      fill
      className="object-cover"
      data-ai-hint="recipe food"
    />
  );
}

export default async function RecipeDetailPage({ params }: { params: { slug: string } }) {
  const recipeName = unslugify(params.slug);

  const recipeDetails = await getRecipeDetails({ recipeName });

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="mb-8 inline-flex items-center">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to recipes
          </Button>
        </Link>
        <Card className="overflow-hidden shadow-xl">
          <div className="relative aspect-[16/9] w-full">
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <RecipeImage recipeName={recipeName} />
            </Suspense>
          </div>
          <CardHeader className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
                <ChefHat className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-primary font-headline">Recipe</span>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline">{recipeName}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold font-headline mb-4">Ingredients</h3>
                    <ul className="space-y-2 text-foreground/80 list-disc list-inside">
                        {recipeDetails.ingredients.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold font-headline mb-4">Instructions</h3>
                    <div className="space-y-4 text-foreground/90">
                        <ol className="list-decimal list-inside space-y-3">
                           {recipeDetails.instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                           ))}
                        </ol>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
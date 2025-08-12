import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChefHat } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function unslugify(slug: string) {
    const words = slug.split('-');
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function RecipeDetailPage({ params }: { params: { slug: string } }) {
  const recipeName = unslugify(params.slug);
  const dataAiHint = recipeName.split(' ').slice(0, 2).join(' ').toLowerCase();

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
            <Image
              src={`https://placehold.co/1200x675.png`}
              alt={recipeName}
              fill
              className="object-cover"
              data-ai-hint={dataAiHint}
            />
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
                        <li>4 large eggs</li>
                        <li>2 tbsp milk</li>
                        <li>1 tbsp butter</li>
                        <li>Salt and pepper to taste</li>
                        <li>Optional: chives, cheese</li>
                        <li>... and other things</li>
                    </ul>
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-xl font-bold font-headline mb-4">Instructions</h3>
                    <div className="space-y-4 text-foreground/90">
                        <p>This is a placeholder for the recipe instructions. A real recipe would have detailed steps on how to prepare and cook this dish.</p>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>First, you do something with the ingredients. It is a very important step.</li>
                            <li>Then, combine them in a specific way. Don't mess this up.</li>
                            <li>After that, apply heat or cold, depending on the recipe. This is where the magic happens.</li>
                            <li>Finally, serve and enjoy your delicious creation! You've earned it.</li>
                        </ol>
                        <p>Remember to adjust seasonings to your liking and consult a real chef for actual cooking advice.</p>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

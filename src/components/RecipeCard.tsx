import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { generateRecipeImage } from '@/ai/flows/generate-recipe-image';
import { Skeleton } from './ui/skeleton';
import { Suspense } from 'react';

interface RecipeCardProps {
  recipeName: string;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function RecipeImage({ recipeName }: { recipeName: string }) {
  const { imageUrl } = await generateRecipeImage({ recipeName });
  return (
    <Image
      src={imageUrl}
      alt={recipeName}
      fill
      className="object-cover"
    />
  );
}

export default function RecipeCard({ recipeName }: RecipeCardProps) {
  const slug = slugify(recipeName);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ease-in-out">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <RecipeImage recipeName={recipeName} />
          </Suspense>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <CardTitle className="text-lg font-headline font-bold flex-grow">{recipeName}</CardTitle>
        <Link href={`/recipes/${slug}`} passHref className="mt-4">
          <Button variant="outline" className="w-full">
            View Recipe
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

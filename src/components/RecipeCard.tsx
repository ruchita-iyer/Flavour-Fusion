import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

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

export default function RecipeCard({ recipeName }: RecipeCardProps) {
  const slug = slugify(recipeName);
  const dataAiHint = recipeName.split(' ').slice(0, 2).join(' ').toLowerCase();

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ease-in-out">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={`https://placehold.co/600x400.png`}
            alt={recipeName}
            fill
            className="object-cover"
            data-ai-hint={dataAiHint}
          />
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

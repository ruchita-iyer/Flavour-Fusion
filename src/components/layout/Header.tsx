
import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-6 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline text-foreground">Recipe Browser</h1>
        </Link>
      </div>
    </header>
  );
}

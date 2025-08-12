import RecipeGenerator from "@/components/RecipeGenerator";
import RecipeList from "@/components/RecipeList";
import { ChefHat } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-block bg-primary/10 p-3 rounded-lg mb-4">
           <ChefHat className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
          What's for dinner tonight?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          No more staring at a full fridge with no ideas. Tell us what ingredients you have, and we'll whip up some delicious recipe suggestions for you.
        </p>
      </div>
      <div className="mt-12">
        <RecipeGenerator>
            <RecipeList recipes={[]} />
        </RecipeGenerator>
      </div>
    </div>
  );
}

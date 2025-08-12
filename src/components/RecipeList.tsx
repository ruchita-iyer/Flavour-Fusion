import RecipeCard from './RecipeCard';

interface RecipeListProps {
  recipes: string[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
    if (!recipes || recipes.length === 0) {
        return null;
    }
    
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold font-headline mb-4">Your Recipe Ideas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipeName={recipe} />
            ))}
            </div>
      </div>
    );
}

import RecipeCard from './RecipeCard';

interface RecipeListProps {
  recipes: string[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipeName={recipe} />
      ))}
    </div>
  );
}

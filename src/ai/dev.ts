import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-recipes.ts';
import '@/ai/flows/get-recipe-details.ts';
import '@/ai/flows/generate-recipe-image.ts';

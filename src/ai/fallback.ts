/**
 * Helper to execute Genkit prompt actions with model fallback.
 */

const FALLBACK_MODELS = [
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.0-flash',
  'googleai/gemini-1.5-flash',
  'googleai/gemini-2.5-pro',
  'googleai/gemini-1.5-pro'
];

export async function executeWithFallback<I, O>(
  promptAction: (input: I, options?: any) => Promise<{ output?: O | null }>,
  input: I
): Promise<O> {
  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`[AI Fallback] Attempting execution with model: ${model}`);
      const { output } = await promptAction(input, { model });
      if (output) {
        console.log(`[AI Fallback] Successfully executed with model: ${model}`);
        return output;
      }
    } catch (e: any) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.error(`[AI Fallback] Model ${model} failed:`, errMsg);
      lastError = e;

      // Only fallback/retry if it's a rate limit or transient service error
      const isRetryable = errMsg.includes('429') || 
                          errMsg.includes('503') ||
                          errMsg.toLowerCase().includes('quota') || 
                          errMsg.toLowerCase().includes('rate limit') || 
                          errMsg.toLowerCase().includes('exhausted') ||
                          errMsg.toLowerCase().includes('unavailable') ||
                          errMsg.toLowerCase().includes('service unavailable');

      if (!isRetryable) {
        throw e;
      }
    }
  }

  throw lastError || new Error("All fallback models failed.");
}

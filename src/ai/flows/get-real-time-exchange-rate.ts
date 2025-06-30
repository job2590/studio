'use server';
/**
 * @fileOverview Fetches the real-time BOB/USDT exchange rate from a reliable source.
 *
 * - getRealTimeExchangeRate - A function that fetches the real-time exchange rate.
 * - GetRealTimeExchangeRateOutput - The return type for the getRealTimeExchangeRate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRealTimeExchangeRateOutputSchema = z.object({
  exchangeRate: z.number().describe('The current BOB/USDT exchange rate.'),
});

export type GetRealTimeExchangeRateOutput = z.infer<typeof GetRealTimeExchangeRateOutputSchema>;

export async function getRealTimeExchangeRate(): Promise<GetRealTimeExchangeRateOutput> {
  return getRealTimeExchangeRateFlow();
}

const prompt = ai.definePrompt({
  name: 'getRealTimeExchangeRatePrompt',
  output: {schema: GetRealTimeExchangeRateOutputSchema},
  prompt: `What is the current BOB/USDT exchange rate? Return the result as a number.`, // Keep it simple, the model knows it's about BOB/USDT.
});

const getRealTimeExchangeRateFlow = ai.defineFlow(
  {
    name: 'getRealTimeExchangeRateFlow',
    outputSchema: GetRealTimeExchangeRateOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);

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
  prompt: `You are a financial data analyst. Your task is to provide the most current official exchange rate for Bolivian Boliviano (BOB) to USDT. This should reflect the official bank rate in Bolivia, not P2P market rates. Provide only the numerical value for 1 USDT in BOB.`,
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

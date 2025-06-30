'use server';

/**
 * @fileOverview Calculates the current value of USDT in BOB and shows the percentage reduction compared to the initial BOB investment.
 *
 * - calculateBOBValue - A function that handles the BOB value calculation process.
 * - CalculateBOBValueInput - The input type for the calculateBOBValue function.
 * - CalculateBOBValueOutput - The return type for the calculateBOBValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateBOBValueInputSchema = z.object({
  initialBOBAmount: z.number().describe('The initial amount spent in BOB.'),
  bobToUSDTExchangeRate: z.number().describe('The BOB/USDT exchange rate used during the initial Binance P2P transaction.'),
  currentUSDTBalance: z.number().describe('The current USDT balance remaining in the wallet.'),
  officialBOBToUSDTExchangeRate: z.number().describe('The current official BOB/USDT exchange rate.'),
});
export type CalculateBOBValueInput = z.infer<typeof CalculateBOBValueInputSchema>;

const CalculateBOBValueOutputSchema = z.object({
  availableBOBValue: z.number().describe('The calculated BOB value available based on the current USDT balance and official exchange rate.'),
  percentageReduction: z.number().describe('The percentage reduction in value compared to the initial BOB amount.'),
});
export type CalculateBOBValueOutput = z.infer<typeof CalculateBOBValueOutputSchema>;

export async function calculateBOBValue(input: CalculateBOBValueInput): Promise<CalculateBOBValueOutput> {
  return calculateBOBValueFlow(input);
}

const calculateBOBValueFlow = ai.defineFlow(
  {
    name: 'calculateBOBValueFlow',
    inputSchema: CalculateBOBValueInputSchema,
    outputSchema: CalculateBOBValueOutputSchema,
  },
  async input => {
    const availableBOBValue = input.currentUSDTBalance * input.officialBOBToUSDTExchangeRate;
    const percentageReduction = ((input.initialBOBAmount - availableBOBValue) / input.initialBOBAmount) * 100;

    return {
      availableBOBValue,
      percentageReduction,
    };
  }
);

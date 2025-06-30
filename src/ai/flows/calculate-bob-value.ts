'use server';
/**
 * @fileOverview Calculates the real value of BOB after a P2P transaction.
 *
 * - calculateBOBValue - A function that handles the value calculation.
 * - CalculateBOBValueInput - The input type for the calculateBOBValue function.
 * - CalculateBOBValueOutput - The return type for the calculateBOBValue function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CalculateBOBValueInputSchema = z.object({
    initialBOBAmount: z.number().describe("The initial amount in BOB."),
    p2pRate: z.number().describe("The P2P exchange rate used for the transaction."),
    officialBOBToUSDTExchangeRate: z.number().describe("The official BOB to USDT exchange rate."),
});
export type CalculateBOBValueInput = z.infer<typeof CalculateBOBValueInputSchema>;

const CalculateBOBValueOutputSchema = z.object({
    usdtPurchased: z.number().describe("The amount of USDT purchased."),
    availableBOBValue: z.number().describe("The equivalent value in BOB at the official rate."),
    percentageReduction: z.number().describe("The percentage reduction or gain in value."),
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
  async (input) => {
    const {
      initialBOBAmount,
      p2pRate,
      officialBOBToUSDTExchangeRate,
    } = input;

    // Calculate the amount of USDT purchased
    const usdtPurchased = initialBOBAmount / p2pRate;

    // Calculate the equivalent value of the purchased USDT in BOB at the official rate
    const availableBOBValue = usdtPurchased * officialBOBToUSDTExchangeRate;

    // Calculate the percentage reduction or gain
    const percentageReduction = ((availableBOBValue - initialBOBAmount) / initialBOBAmount) * 100;

    return {
      usdtPurchased,
      availableBOBValue,
      percentageReduction,
    };
  },
);
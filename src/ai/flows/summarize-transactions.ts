// Summarize transactions for a given period using AI to understand spending habits.

'use server';

/**
 * @fileOverview Summarizes user transactions for a given period using AI.
 *
 * - summarizeTransactions - A function that handles the transaction summarization process.
 * - SummarizeTransactionsInput - The input type for the summarizeTransactions function.
 * - SummarizeTransactionsOutput - The return type for the summarizeTransactions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTransactionsInputSchema = z.object({
  transactions: z.string().describe('A list of transactions as a JSON string.'),
  period: z.string().describe('The period for which to summarize transactions (e.g., "last month", "this year").'),
});

export type SummarizeTransactionsInput = z.infer<typeof SummarizeTransactionsInputSchema>;

const SummarizeTransactionsOutputSchema = z.object({
  summary: z.string().describe('A summary of the transactions for the given period.'),
});

export type SummarizeTransactionsOutput = z.infer<typeof SummarizeTransactionsOutputSchema>;

export async function summarizeTransactions(input: SummarizeTransactionsInput): Promise<SummarizeTransactionsOutput> {
  return summarizeTransactionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTransactionsPrompt',
  input: {schema: SummarizeTransactionsInputSchema},
  output: {schema: SummarizeTransactionsOutputSchema},
  prompt: `You are an AI assistant helping users understand their spending habits.

  Summarize the following transactions for the given period:

  Period: {{{period}}}
  Transactions: {{{transactions}}}

  Provide a concise and informative summary of the user's spending habits during this period.
  Include key trends, categories of spending, and overall financial status based on the transactions.`,
});

const summarizeTransactionsFlow = ai.defineFlow(
  {
    name: 'summarizeTransactionsFlow',
    inputSchema: SummarizeTransactionsInputSchema,
    outputSchema: SummarizeTransactionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

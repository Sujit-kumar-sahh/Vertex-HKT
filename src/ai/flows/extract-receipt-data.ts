'use server';

/**
 * @fileOverview This flow extracts data from a receipt image using OCR and NLP.
 *
 * - extractReceiptData - A function that handles the receipt data extraction process.
 * - ExtractReceiptDataInput - The input type for the extractReceiptData function.
 * - ExtractReceiptDataOutput - The return type for the extractReceiptData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractReceiptDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected the expected format description
    ),
});
export type ExtractReceiptDataInput = z.infer<typeof ExtractReceiptDataInputSchema>;

const ExtractReceiptDataOutputSchema = z.object({
  date: z.string().describe('The date on the receipt.'),
  amount: z.number().describe('The total amount on the receipt.'),
  vendor: z.string().describe('The name of the vendor on the receipt.'),
  category: z.string().describe('The category of the expense.'),
  summary: z.string().describe('A brief summary of the receipt.'),
});
export type ExtractReceiptDataOutput = z.infer<typeof ExtractReceiptDataOutputSchema>;

export async function extractReceiptData(
  input: ExtractReceiptDataInput
): Promise<ExtractReceiptDataOutput> {
  return extractReceiptDataFlow(input);
}

const extractReceiptDataPrompt = ai.definePrompt({
  name: 'extractReceiptDataPrompt',
  input: {schema: ExtractReceiptDataInputSchema},
  output: {schema: ExtractReceiptDataOutputSchema},
  prompt: `You are an expert in extracting data from receipts. Please extract the following information from the receipt image provided:

- Date
- Amount
- Vendor
- Category
- Summary

Use OCR to read the text from the image and NLP to categorize and summarize the data.

Receipt Image: {{media url=photoDataUri}}

Ensure the amount is a number, and the date, vendor, category and summary are strings.

Return the data in JSON format.`, // Added more explicit instructions and formatting guidelines
});

const extractReceiptDataFlow = ai.defineFlow(
  {
    name: 'extractReceiptDataFlow',
    inputSchema: ExtractReceiptDataInputSchema,
    outputSchema: ExtractReceiptDataOutputSchema,
  },
  async input => {
    const {output} = await extractReceiptDataPrompt(input);
    return output!;
  }
);

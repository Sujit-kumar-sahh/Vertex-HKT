import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-transactions.ts';
import '@/ai/flows/extract-receipt-data.ts';
import '@/ai/flows/categorize-transaction.ts';
import '@/ai/flows/chat-flow.ts';

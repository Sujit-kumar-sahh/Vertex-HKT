import type { Timestamp } from 'firebase/firestore';

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  vendor: string;
  category: string;
  summary: string;
  createdAt: Timestamp;
  type: 'income' | 'expense';
};

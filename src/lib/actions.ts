'use server';

import { z } from 'zod';
import { extractReceiptData } from '@/ai/flows/extract-receipt-data';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const UploadReceiptSchema = z.object({
  receipt: z
    .any()
    .refine((file) => file?.size > 0, 'Receipt image is required.'),
  userId: z.string(),
});

function toDataURI(buffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function uploadReceiptAction(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = UploadReceiptSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data.',
    };
  }

  const { receipt, userId } = validatedFields.data;

  try {
    const bytes = await receipt.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataUri = toDataURI(buffer, receipt.type);

    const extractedData = await extractReceiptData({ photoDataUri: dataUri });

    if (!extractedData) {
      return { error: 'Failed to extract data from receipt.' };
    }

    await addDoc(collection(db, `users/${userId}/transactions`), {
      ...extractedData,
      createdAt: serverTimestamp(),
      type: 'expense'
    });

    revalidatePath('/dashboard');
    return { success: 'Receipt processed and transaction added.' };
  } catch (error) {
    console.error('Error processing receipt:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

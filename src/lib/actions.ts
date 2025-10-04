'use server';

import { z } from 'zod';
import { extractReceiptData } from '@/ai/flows/extract-receipt-data';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/lib/errors';

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

    const transactionData = {
      ...extractedData,
      createdAt: serverTimestamp(),
      type: 'expense'
    };

    const collectionRef = collection(db, `users/${userId}/transactions`);
    
    addDoc(collectionRef, transactionData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: transactionData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });

    revalidatePath('/dashboard');
    return { success: 'Receipt processed and transaction added.' };
  } catch (error) {
    console.error('Error processing receipt:', error);
    // This will now only catch errors from receipt extraction or other non-Firestore issues.
    return { error: 'An unexpected error occurred while processing the receipt data.' };
  }
}

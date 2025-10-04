'use client';

import {useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {errorEmitter} from '@/lib/error-emitter';

// This is a client-side only component that will listen for Firestore permission errors
// and display a toast with a detailed error message to help with debugging security rules.
export default function FirebaseErrorListener() {
  const {toast} = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      console.error('Caught permission error:', error);
      toast({
        variant: 'destructive',
        title: 'Firestore Permission Error',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{error.toString()}</code>
          </pre>
        ),
        duration: 20000, // 20 seconds
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}

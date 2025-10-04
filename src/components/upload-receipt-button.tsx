'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadReceiptDialog } from '@/components/upload-receipt-dialog';
import { PlusCircle } from 'lucide-react';

export function UploadReceiptButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Upload Receipt
      </Button>
      <UploadReceiptDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

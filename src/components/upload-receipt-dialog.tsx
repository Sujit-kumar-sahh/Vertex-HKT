'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { uploadReceiptAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, UploadCloud } from 'lucide-react';

const UploadSchema = z.object({
  receipt: z.any().refine(file => file instanceof File, 'Please upload a file.'),
});

type UploadReceiptDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function UploadReceiptDialog({ isOpen, onOpenChange }: UploadReceiptDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('receipt', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof UploadSchema>) => {
    if (!user) return;

    const formData = new FormData();
    formData.append('receipt', values.receipt);
    formData.append('userId', user.uid);
    
    startTransition(async () => {
      const result = await uploadReceiptAction(formData);
      if (result?.error) {
        toast({
          title: 'Upload Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Upload Successful',
          description: 'Your receipt has been processed.',
        });
        handleClose();
      }
    });
  };
  
  const handleClose = () => {
    form.reset();
    setPreview(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Upload Receipt</DialogTitle>
          <DialogDescription>Let AI process your receipt and add it as a transaction.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="receipt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt Image</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <div
                        className="mt-1 flex justify-center rounded-md border-2 border-dashed border-input px-6 pt-5 pb-6 cursor-pointer hover:border-primary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="space-y-1 text-center">
                          {preview ? (
                             <Image src={preview} alt="Receipt preview" width={200} height={200} className="mx-auto h-24 w-auto object-contain" />
                          ) : (
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          )}
                          <div className="flex text-sm text-muted-foreground">
                            <p className="pl-1">Click to upload a file</p>
                          </div>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleClose} disabled={isPending}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Process Receipt
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

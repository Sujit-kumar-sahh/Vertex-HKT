'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from "@/lib/firebase";
import { Transaction } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentTransactions() {
  const { user } = useAuth();
  const [value, loading, error] = useCollection(
    user ? query(collection(db, `users/${user.uid}/transactions`), orderBy('createdAt', 'desc'), limit(5)) : null
  );

  const transactions = value?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>Your 5 most recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
              </TableRow>
            ))}
            {!loading && transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.vendor}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
             {!loading && transactions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                    No transactions yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

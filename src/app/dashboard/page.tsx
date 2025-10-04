'use client';

import {
  DollarSign,
  Package,
  Receipt,
  TrendingUp
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { UploadReceiptButton } from "@/components/upload-receipt-button";
import { useAuth } from "@/hooks/use-auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Transaction } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalSpent: 0, totalIncome: 0, transactionCount: 0 });
  const [chartData, setChartData] = useState<{ category: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(doc => ({ ...doc.data() } as Omit<Transaction, 'id'>));
      
      let totalSpent = 0;
      let totalIncome = 0;
      const categoryTotals: { [key: string]: number } = {};

      transactions.forEach(t => {
        if (t.type === 'expense') {
          totalSpent += t.amount;
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        } else {
          totalIncome += t.amount;
        }
      });

      setStats({ totalSpent, totalIncome, transactionCount: transactions.length });
      
      const formattedChartData = Object.entries(categoryTotals)
        .map(([category, total]) => ({ category, total }))
        .sort((a, b) => b.total - a.total);
      
      setChartData(formattedChartData);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  if (loading) {
    return (
      <>
        <PageHeader title="Dashboard" action={<Skeleton className="h-10 w-36" />} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4"><Skeleton className="h-96" /></div>
          <div className="col-span-3"><Skeleton className="h-96" /></div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Here's a summary of your financial activity."
        action={<UploadReceiptButton />}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Spent"
          value={currencyFormatter.format(stats.totalSpent)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="+20.1% from last month"
        />
        <StatsCard
          title="Total Income"
          value={currencyFormatter.format(stats.totalIncome)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="+180.1% from last month"
        />
        <StatsCard
          title="Transactions"
          value={`+${stats.transactionCount}`}
          icon={<Receipt className="h-4 w-4 text-muted-foreground" />}
          description="+19% from last month"
        />
        <StatsCard
          title="Categories"
          value={`+${chartData.length}`}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          description="Your top spending categories"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <SpendingChart data={chartData} />
        </div>
        <div className="col-span-3">
          <RecentTransactions />
        </div>
      </div>
    </>
  );
}

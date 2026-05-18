'use client'

import { useState } from "react";
import Navbar from "@/components/expense/Navbar";
import Expenses from "@/components/expense/expenses";
import Income from "@/components/income/income";
import Chart from "@/components/chart/chart";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <Chart />
          </div>
          
          {/* Transactions Section */}
          <div className="lg:col-span-2">
            {activeTab === 'expense' ? <Expenses /> : <Income />}
          </div>
        </div>
      </main>
    </div>
  );
}

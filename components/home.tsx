'use client'

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Navbar from "@/components/expense/Navbar";
import Expenses from "@/components/expense/expenses";
import Income from "@/components/income/income";
import Chart from "@/components/chart/chart";
import BudgetManager from "@/components/budget/budgetManager";
import { exportAllData } from "@/utils/exportData";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'expense' | 'income' | 'budget'>('expense');
  const expenses = useSelector((state: RootState) => state.user.expense);
  const incomes = useSelector((state: RootState) => state.user.incomes);

  const handleExport = () => {
    exportAllData(expenses, incomes);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <Chart />
          </div>

          {/* Export Button */}
          <div className="lg:col-span-2">
            <button
              onClick={handleExport}
              className="w-full sm:w-auto px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>📥</span>
              Export to CSV
            </button>
          </div>
          
          {/* Transactions/Budget Section */}
          <div className="lg:col-span-2">
            {activeTab === 'expense' ? (
              <Expenses />
            ) : activeTab === 'income' ? (
              <Income />
            ) : (
              <BudgetManager />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

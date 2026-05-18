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
    <div className="min-h-screen bg-white dark:bg-black page-transition">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Track, manage, and optimize your finances
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 animate-slideIn">
            <Chart />
          </div>

          {/* Export Button */}
          <div className="lg:col-span-2 animate-fadeIn">
            <button
              onClick={handleExport}
              className="group relative w-full sm:w-auto px-8 py-4 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📥</span>
              <span className="relative z-10">Export to CSV</span>
            </button>
          </div>
          
          {/* Transactions/Budget Section */}
          <div className="lg:col-span-2 animate-scaleIn">
            {activeTab === 'expense' ? (
              <Expenses />
            ) : activeTab === 'income' ? (
              <Income />
            ) : (
              <BudgetManager />
            )}
          </div>
        </div>

        {/* Footer removed */}
      </main>
    </div>
  );
}

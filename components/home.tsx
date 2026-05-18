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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 page-transition">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
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
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/50 flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span className="text-2xl">📥</span>
              <span className="relative z-10">Export to CSV</span>
              <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
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

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm animate-fadeIn">
          <p>Made with ❤️ for better financial management</p>
        </footer>
      </main>
    </div>
  );
}

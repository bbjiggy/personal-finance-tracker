'use client'

import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import { useState, useMemo } from "react";
import Modal from '@/components/chart/chartModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';
type ChartView = 'overview' | 'categories';

export default function Chart() {
  const allExpenses = useSelector((state: RootState) => state.user.expense);
  const allIncomes = useSelector((state: RootState) => state.user.incomes);
  const [isOpen, setOpen] = useState(false);
  const [modalType, setModalType] = useState<'expense' | 'income'>('expense');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');
  const [chartView, setChartView] = useState<ChartView>('overview');

  const { expenseData, incomeData, labels } = useMemo(() => {
    const now = new Date();
    const dataMap = new Map<string, { expense: number; income: number }>();

    const processTransactions = (transactions: typeof allExpenses, type: 'expense' | 'income') => {
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        let key = '';

        switch (timeFrame) {
          case 'daily':
            key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            break;
          case 'weekly':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            break;
          case 'monthly':
            key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            break;
          case 'yearly':
            key = date.getFullYear().toString();
            break;
        }

        if (!dataMap.has(key)) {
          dataMap.set(key, { expense: 0, income: 0 });
        }
        const current = dataMap.get(key)!;
        if (type === 'expense') {
          current.expense += transaction.price;
        } else {
          current.income += transaction.price;
        }
      });
    };

    processTransactions(allExpenses, 'expense');
    processTransactions(allIncomes, 'income');

    const sortedEntries = Array.from(dataMap.entries()).sort((a, b) => {
      return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });

    return {
      labels: sortedEntries.map(([key]) => key),
      expenseData: sortedEntries.map(([, value]) => value.expense),
      incomeData: sortedEntries.map(([, value]) => value.income)
    };
  }, [allExpenses, allIncomes, timeFrame]);

  const totalExpense = allExpenses.reduce((sum, t) => sum + t.price, 0);
  const totalIncome = allIncomes.reduce((sum, t) => sum + t.price, 0);
  const balance = totalIncome - totalExpense;

  // Category breakdown data
  const categoryData = useMemo(() => {
    const expenseByCategory = new Map<string, number>();
    const incomeByCategory = new Map<string, number>();

    allExpenses.forEach(expense => {
      const current = expenseByCategory.get(expense.category) || 0;
      expenseByCategory.set(expense.category, current + expense.price);
    });

    allIncomes.forEach(income => {
      const current = incomeByCategory.get(income.category) || 0;
      incomeByCategory.set(income.category, current + income.price);
    });

    const expenseCategories = Array.from(expenseByCategory.keys());
    const expenseAmounts = expenseCategories.map(cat => expenseByCategory.get(cat) || 0);

    const incomeCategories = Array.from(incomeByCategory.keys());
    const incomeAmounts = incomeCategories.map(cat => incomeByCategory.get(cat) || 0);

    return {
      expenseCategories,
      expenseAmounts,
      incomeCategories,
      incomeAmounts
    };
  }, [allExpenses, allIncomes]);

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      }
    ]
  };

  const doughnutData = {
    labels: ['Expenses', 'Income'],
    datasets: [{
      data: [totalExpense, totalIncome],
      backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(34, 197, 94, 0.7)'],
      borderColor: ['rgb(239, 68, 68)', 'rgb(34, 197, 94)'],
      borderWidth: 2
    }]
  };

  const expenseCategoryData = {
    labels: categoryData.expenseCategories,
    datasets: [{
      label: 'Expenses by Category',
      data: categoryData.expenseAmounts,
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(168, 85, 247, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(251, 146, 60, 0.7)'
      ],
      borderWidth: 2
    }]
  };

  const incomeCategoryData = {
    labels: categoryData.incomeCategories,
    datasets: [{
      label: 'Income by Category',
      data: categoryData.incomeAmounts,
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(5, 150, 105, 0.7)',
        'rgba(6, 182, 212, 0.7)',
        'rgba(14, 165, 233, 0.7)',
        'rgba(99, 102, 241, 0.7)'
      ],
      borderWidth: 2
    }]
  };

  const addTransaction = (type: 'expense' | 'income') => {
    setModalType(type);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 animate-slideIn">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-sm opacity-90 mb-2 font-semibold">💵 Total Income</p>
            <p className="text-4xl font-bold number-animate">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-emerald-300"></div>
        </div>
        
        <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 animate-slideIn" style={{animationDelay: '0.1s'}}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-sm opacity-90 mb-2 font-semibold">💸 Total Expenses</p>
            <p className="text-4xl font-bold number-animate">${totalExpense.toFixed(2)}</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-300 to-pink-300"></div>
        </div>
        
        <div className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slideIn ${
          balance >= 0 
            ? 'bg-gradient-to-br from-blue-500 to-cyan-600 hover:shadow-blue-500/50' 
            : 'bg-gradient-to-br from-orange-500 to-red-600 hover:shadow-orange-500/50'
        }`} style={{animationDelay: '0.2s'}}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-sm opacity-90 mb-2 font-semibold">💰 Balance</p>
            <p className="text-4xl font-bold number-animate">${balance.toFixed(2)}</p>
          </div>
          <div className={`absolute bottom-0 left-0 w-full h-1 ${
            balance >= 0 
              ? 'bg-gradient-to-r from-blue-300 to-cyan-300' 
              : 'bg-gradient-to-r from-orange-300 to-red-300'
          }`}></div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 animate-scaleIn">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-3xl">📊</span>
              Statistics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Visualize your financial data</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl">
              <button
                onClick={() => setChartView('overview')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  chartView === 'overview'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600'
                }`}
              >
                📈 Overview
              </button>
              <button
                onClick={() => setChartView('categories')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  chartView === 'categories'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600'
                }`}
              >
                🎯 Categories
              </button>
            </div>
            
            {chartView === 'overview' && (
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl">
                {(['daily', 'weekly', 'monthly', 'yearly'] as TimeFrame[]).map((frame) => (
                  <button
                    key={frame}
                    onClick={() => setTimeFrame(frame)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-300 ${
                      timeFrame === frame
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {frame}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {allExpenses.length === 0 && allIncomes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
              No transactions yet. Start tracking your finances!
            </p>
          </div>
        ) : chartView === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false }
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-xs">
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Expenses by Category
              </h3>
              {categoryData.expenseCategories.length > 0 ? (
                <div className="w-full max-w-sm">
                  <Pie
                    data={expenseCategoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No expense data</p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Income by Category
              </h3>
              {categoryData.incomeCategories.length > 0 ? (
                <div className="w-full max-w-sm">
                  <Pie
                    data={incomeCategoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No income data</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn">
        <button
          onClick={() => addTransaction('expense')}
          className="group relative flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
            <span className="text-2xl">💸</span>
            Add Expense
          </span>
        </button>
        <button
          onClick={() => addTransaction('income')}
          className="group relative flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
            <span className="text-2xl">💵</span>
            Add Income
          </span>
        </button>
      </div>

      <Modal isOpen={isOpen} setOpen={setOpen} type={modalType} editTransaction={null} />
    </div>
  );
}

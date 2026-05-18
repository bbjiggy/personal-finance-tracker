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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Income</p>
          <p className="text-3xl font-bold">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold">${totalExpense.toFixed(2)}</p>
        </div>
        <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-lg p-6 text-white shadow-lg`}>
          <p className="text-sm opacity-90 mb-1">Balance</p>
          <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Statistics</h2>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setChartView('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  chartView === 'overview'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setChartView('categories')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  chartView === 'categories'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Categories
              </button>
            </div>
            
            {chartView === 'overview' && (
              <div className="flex gap-2">
                {(['daily', 'weekly', 'monthly', 'yearly'] as TimeFrame[]).map((frame) => (
                  <button
                    key={frame}
                    onClick={() => setTimeFrame(frame)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                      timeFrame === frame
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => addTransaction('expense')}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          + Add Expense
        </button>
        <button
          onClick={() => addTransaction('income')}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          + Add Income
        </button>
      </div>

      <Modal isOpen={isOpen} setOpen={setOpen} type={modalType} editTransaction={null} />
    </div>
  );
}

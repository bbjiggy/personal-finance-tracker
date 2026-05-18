'use client'

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { deleteTransaction } from "@/redux/userSlice";
import { useState } from "react";
import Modal from "@/components/chart/chartModal";
import { Transaction } from "@/interfaces/interfaces";

export default function Expenses() {
  const expenses = useSelector((state: RootState) => state.user.expense);
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [filterText, setFilterText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  const sortedExpenses = [...expenses]
    .filter(expense => {
      const matchesText = expense.title.toLowerCase().includes(filterText.toLowerCase()) ||
                         expense.description.toLowerCase().includes(filterText.toLowerCase()) ||
                         expense.tags.some(tag => tag.toLowerCase().includes(filterText.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      
      const expenseDate = new Date(expense.date);
      const matchesDateFrom = !dateFrom || expenseDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || expenseDate <= new Date(dateTo);
      
      return matchesText && matchesCategory && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.price - a.price;
    });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteTransaction({ id, type: 'expense' }));
    }
  };

  const handleEdit = (expense: Transaction) => {
    setEditingTransaction(expense);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 animate-scaleIn">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <span className="text-4xl">💸</span>
                Expenses
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Track and manage your spending</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="🔍 Search expenses..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-gray-800 dark:border-gray-200 dark:bg-gray-700/50 dark:text-white transition-all duration-200 backdrop-blur-sm"
            />
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-gray-800 dark:border-gray-200 dark:bg-gray-700/50 dark:text-white transition-all duration-200 backdrop-blur-sm"
            >
              <option value="all">📂 All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-gray-800 dark:border-gray-200 dark:bg-gray-700/50 dark:text-white transition-all duration-200 backdrop-blur-sm"
            >
              <option value="date">📅 Sort by Date</option>
              <option value="amount">💰 Sort by Amount</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">📅 From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-gray-800 dark:border-gray-200 dark:bg-gray-700/50 dark:text-white transition-all duration-200 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">📅 To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-gray-800 dark:border-gray-200 dark:bg-gray-700/50 dark:text-white transition-all duration-200 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {filterText || categoryFilter !== 'all' || dateFrom || dateTo 
                ? 'No expenses match your filters' 
                : 'No expenses recorded yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedExpenses.map((expense, index) => (
              <div
                key={expense.id}
                className="group relative transaction-card p-6 bg-white dark:bg-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-2xl border-l-4 border-gray-800 dark:border-gray-200 shadow-lg hover:shadow-2xl hover:shadow-gray-800/20 dark:hover:shadow-gray-200/20 animate-slideIn"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800/5 dark:bg-gray-200/5 rounded-full -mr-16 -mt-16 group-hover:bg-gray-800/10 dark:bg-gray-200/10 transition-all duration-300"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">
                          {expense.title}
                        </h3>
                        <span className="inline-block text-xs font-bold bg-black dark:bg-white dark:from-gray-200 dark:to-gray-100 text-white px-3 py-1.5 rounded-full shadow-md">
                          {expense.category}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-bold text-2xl whitespace-nowrap">
                        -${expense.price.toFixed(2)}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 leading-relaxed">
                        {expense.description}
                      </p>
                    )}
                    {expense.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {expense.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-4">
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-2">
                        <span>📅</span>
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {expense.isRecurring && (
                        <span className="text-xs bg-black dark:bg-white text-white px-3 py-1 rounded-full font-bold shadow-md">
                          🔄 {expense.recurringFrequency}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 relative z-10">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="px-5 py-2.5 bg-black dark:bg-white hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 text-sm font-bold shadow-lg hover:shadow-blue-500/50"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="px-5 py-2.5 bg-black dark:bg-white dark:from-gray-200 dark:to-gray-100 hover:from-gray-900 hover:to-black dark:hover:from-gray-100 dark:hover:to-white text-white rounded-xl transition-all duration-300 transform hover:scale-105 text-sm font-bold shadow-lg hover:shadow-gray-800/50 dark:shadow-gray-200/50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedExpenses.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-600 animate-fadeIn">
            <div className="flex justify-between items-center bg-black dark:bg-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl">
              <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">
                💸 Total Expenses ({sortedExpenses.length}):
              </span>
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${sortedExpenses.reduce((sum, e) => sum + e.price, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        setOpen={handleModalClose} 
        type="expense"
        editTransaction={editingTransaction}
      />
    </>
  );
}

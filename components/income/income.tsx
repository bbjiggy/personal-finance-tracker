'use client'

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { deleteTransaction } from "@/redux/userSlice";
import { useState } from "react";
import Modal from "@/components/chart/chartModal";
import { Transaction } from "@/interfaces/interfaces";

export default function Income() {
  const incomes = useSelector((state: RootState) => state.user.incomes);
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [filterText, setFilterText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = Array.from(new Set(incomes.map(i => i.category)));

  const sortedIncomes = [...incomes]
    .filter(income => {
      const matchesText = income.title.toLowerCase().includes(filterText.toLowerCase()) ||
                         income.description.toLowerCase().includes(filterText.toLowerCase()) ||
                         income.tags.some(tag => tag.toLowerCase().includes(filterText.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || income.category === categoryFilter;
      
      const incomeDate = new Date(income.date);
      const matchesDateFrom = !dateFrom || incomeDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || incomeDate <= new Date(dateTo);
      
      return matchesText && matchesCategory && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.price - a.price;
    });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this income?')) {
      dispatch(deleteTransaction({ id, type: 'income' }));
    }
  };

  const handleEdit = (income: Transaction) => {
    setEditingTransaction(income);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            💵 Income
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Search income..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {sortedIncomes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {filterText || categoryFilter !== 'all' || dateFrom || dateTo 
                ? 'No income matches your filters' 
                : 'No income recorded yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedIncomes.map((income) => (
              <div
                key={income.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow border-l-4 border-green-500"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {income.title}
                      </h3>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                        {income.category}
                      </span>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-bold text-lg whitespace-nowrap">
                      +${income.price.toFixed(2)}
                    </span>
                  </div>
                  {income.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                      {income.description}
                    </p>
                  )}
                  {income.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {income.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                      {new Date(income.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {income.isRecurring && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                        🔄 {income.recurringFrequency}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(income)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(income.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedIncomes.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Total Income ({sortedIncomes.length}):
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${sortedIncomes.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        setOpen={handleModalClose} 
        type="income"
        editTransaction={editingTransaction}
      />
    </>
  );
}

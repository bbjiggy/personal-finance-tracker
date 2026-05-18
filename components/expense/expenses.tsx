'use client'

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { deleteTransaction } from "@/redux/userSlice";
import { useState } from "react";

export default function Expenses() {
  const expenses = useSelector((state: RootState) => state.user.expense);
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [filterText, setFilterText] = useState('');

  const sortedExpenses = [...expenses]
    .filter(expense => 
      expense.title.toLowerCase().includes(filterText.toLowerCase()) ||
      expense.description.toLowerCase().includes(filterText.toLowerCase())
    )
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          💸 Expenses
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search expenses..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {filterText ? 'No expenses match your search' : 'No expenses recorded yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow border-l-4 border-red-500"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {expense.title}
                  </h3>
                  <span className="text-red-600 dark:text-red-400 font-bold text-lg whitespace-nowrap">
                    -${expense.price.toFixed(2)}
                  </span>
                </div>
                {expense.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {expense.description}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(expense.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {sortedExpenses.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Total Expenses:
            </span>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${sortedExpenses.reduce((sum, e) => sum + e.price, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

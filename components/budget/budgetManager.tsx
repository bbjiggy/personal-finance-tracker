'use client'

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { addBudget, updateBudget, deleteBudget } from '@/redux/userSlice';
import { Budget, ExpenseCategory } from '@/interfaces/interfaces';

const expenseCategories: ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

export default function BudgetManager() {
  const dispatch = useDispatch();
  const budgets = useSelector((state: RootState) => state.user.budgets);
  const expenses = useSelector((state: RootState) => state.user.expense);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'Food & Dining' as ExpenseCategory,
    amount: '',
    month: new Date().toISOString().slice(0, 7)
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentBudgets = budgets.filter(b => b.month === currentMonth);

  const getSpentAmount = (category: ExpenseCategory) => {
    return expenses
      .filter(e => {
        const expenseMonth = e.date.slice(0, 7);
        return e.category === category && expenseMonth === currentMonth;
      })
      .reduce((sum, e) => sum + e.price, 0);
  };

  const handleSubmit = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    const budget: Budget = {
      id: editingId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: formData.category,
      amount: parseFloat(formData.amount),
      month: formData.month
    };

    if (editingId) {
      dispatch(updateBudget(budget));
    } else {
      dispatch(addBudget(budget));
    }

    setFormData({
      category: 'Food & Dining',
      amount: '',
      month: currentMonth
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month
    });
    setEditingId(budget.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      dispatch(deleteBudget(id));
    }
  };

  const handleCancel = () => {
    setFormData({
      category: 'Food & Dining',
      amount: '',
      month: currentMonth
    });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          💰 Budget Manager
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            + Add Budget
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            {editingId ? 'Edit Budget' : 'New Budget'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
            >
              {expenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
            />
            <input
              type="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {currentBudgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No budgets set for this month
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentBudgets.map(budget => {
            const spent = getSpentAmount(budget.category);
            const percentage = (spent / budget.amount) * 100;
            const isOverBudget = spent > budget.amount;

            return (
              <div
                key={budget.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {budget.category}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isOverBudget
                        ? 'bg-red-500'
                        : percentage > 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className={`text-sm mt-1 text-right font-semibold ${
                  isOverBudget
                    ? 'text-red-600 dark:text-red-400'
                    : percentage > 80
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {percentage.toFixed(1)}%
                  {isOverBudget && ' (Over Budget!)'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

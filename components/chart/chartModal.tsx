'use client'

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addExpenses, addIncome, updateTransaction } from "@/redux/userSlice";
import { Transaction, ExpenseCategory, IncomeCategory } from "@/interfaces/interfaces";

interface ModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  type: 'expense' | 'income';
  editTransaction?: Transaction | null;
}

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

const incomeCategories: IncomeCategory[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Gift',
  'Other'
];

export default function Modal({ isOpen, setOpen, type, editTransaction }: ModalProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: type === 'expense' ? 'Other' as ExpenseCategory : 'Other' as IncomeCategory,
    tags: '',
    isRecurring: false,
    recurringFrequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        title: editTransaction.title,
        price: editTransaction.price.toString(),
        description: editTransaction.description,
        date: editTransaction.date,
        category: editTransaction.category as any,
        tags: editTransaction.tags.join(', '),
        isRecurring: editTransaction.isRecurring || false,
        recurringFrequency: editTransaction.recurringFrequency || 'monthly'
      });
    } else {
      setFormData({
        title: '',
        price: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: type === 'expense' ? 'Other' as ExpenseCategory : 'Other' as IncomeCategory,
        tags: '',
        isRecurring: false,
        recurringFrequency: 'monthly'
      });
    }
  }, [editTransaction, type, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Amount must be greater than 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setFormData({ 
      title: '', 
      price: '', 
      description: '', 
      date: new Date().toISOString().split('T')[0],
      category: type === 'expense' ? 'Other' as ExpenseCategory : 'Other' as IncomeCategory,
      tags: '',
      isRecurring: false,
      recurringFrequency: 'monthly'
    });
    setErrors({});
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const transaction: Transaction = {
      id: editTransaction?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      price: parseFloat(formData.price),
      description: formData.description,
      date: formData.date,
      type,
      category: formData.category,
      tags,
      isRecurring: formData.isRecurring,
      recurringFrequency: formData.isRecurring ? formData.recurringFrequency : undefined
    };

    if (editTransaction) {
      dispatch(updateTransaction({ id: editTransaction.id, type, data: transaction }));
    } else {
      if (type === 'expense') {
        dispatch(addExpenses(transaction));
      } else {
        dispatch(addIncome(transaction));
      }
    }

    handleCancel();
  };

  if (!isOpen) return null;

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 my-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {editTransaction ? 'Edit' : 'Add'} {type === 'expense' ? 'Expense' : 'Income'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Groceries, Salary"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount * ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <input
              type="text"
              placeholder="e.g., urgent, work, personal (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Optional notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recurring Transaction
              </span>
            </label>

            {formData.isRecurring && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frequency
                </label>
                <select
                  value={formData.recurringFrequency}
                  onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-colors ${
              type === 'expense'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {editTransaction ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

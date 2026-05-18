'use client'

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addExpenses, addIncome } from "@/redux/userSlice";
import { Transaction } from "@/interfaces/interfaces";

interface ModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  type: 'expense' | 'income';
}

export default function Modal({ isOpen, setOpen, type }: ModalProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Amount must be greater than 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setFormData({ title: '', price: '', description: '', date: new Date().toISOString().split('T')[0] });
    setErrors({});
    setOpen(false);
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      title: formData.title,
      price: parseFloat(formData.price),
      description: formData.description,
      date: formData.date,
      type
    };

    if (type === 'expense') {
      dispatch(addExpenses(transaction));
    } else {
      dispatch(addIncome(transaction));
    }

    handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Add {type === 'expense' ? 'Expense' : 'Income'}
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
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount * ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.price ? 'border-red-500' : 'border-gray-300'
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
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-colors ${
              type === 'expense'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

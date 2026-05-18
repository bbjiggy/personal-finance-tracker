'use client'

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setUsername } from "@/redux/userSlice";
import { useState } from "react";

interface NavbarProps {
  activeTab: 'expense' | 'income' | 'budget';
  setActiveTab: (tab: 'expense' | 'income' | 'budget') => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const username = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  const handleSaveUsername = () => {
    if (tempUsername.trim()) {
      dispatch(setUsername(tempUsername.trim()));
      setIsEditing(false);
    }
  };

  return (
    <nav className="bg-black dark:bg-white shadow-2xl sticky top-0 z-50 border-b border-gray-800 dark:border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center group">
            <div className="relative">
              <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-black flex items-center gap-2">
                <span className="text-3xl md:text-4xl">💰</span>
                <span>Finance Tracker</span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setActiveTab('expense')}
              className={`relative px-4 md:px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'expense'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-lg'
                  : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300'
              }`}
            >
              <span className="hidden sm:inline">💸 Expenses</span>
              <span className="sm:hidden text-xl">💸</span>
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`relative px-4 md:px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'income'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-lg'
                  : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300'
              }`}
            >
              <span className="hidden sm:inline">💵 Income</span>
              <span className="sm:hidden text-xl">💵</span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`relative px-4 md:px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'budget'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-lg'
                  : 'bg-gray-800 dark:bg-gray-200 text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300'
              }`}
            >
              <span className="hidden sm:inline">💰 Budget</span>
              <span className="sm:hidden text-xl">💰</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2 animate-fadeIn">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-black text-sm w-24 md:w-32 border border-gray-700 dark:border-gray-300 focus:border-white dark:focus:border-black transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                  autoFocus
                />
                <button
                  onClick={handleSaveUsername}
                  className="text-white dark:text-black hover:text-gray-300 dark:hover:text-gray-600 text-lg transition-all transform hover:scale-110"
                >
                  ✓
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-800 dark:bg-gray-200 hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 border border-gray-700 dark:border-gray-300"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center font-bold text-black dark:text-white shadow-lg border-2 border-gray-700 dark:border-gray-300">
                    {username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className="hidden md:inline text-white dark:text-black font-semibold">
                  {username}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

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
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 shadow-2xl sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center group">
            <div className="relative">
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl md:text-4xl animate-bounce">💰</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Finance Tracker
                </span>
              </h1>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setActiveTab('expense')}
              className={`relative px-4 md:px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'expense'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <span className="hidden sm:inline">💸 Expenses</span>
              <span className="sm:hidden text-xl">💸</span>
              {activeTab === 'expense' && (
                <span className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`relative px-4 md:px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'income'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <span className="hidden sm:inline">💵 Income</span>
              <span className="sm:hidden text-xl">💵</span>
              {activeTab === 'income' && (
                <span className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`relative px-4 md:px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'budget'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <span className="hidden sm:inline">💰 Budget</span>
              <span className="sm:hidden text-xl">💰</span>
              {activeTab === 'budget' && (
                <span className="absolute inset-0 rounded-xl bg-white/20 animate-pulse"></span>
              )}
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
                  className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm w-24 md:w-32 border border-white/20 focus:border-blue-400 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                  autoFocus
                />
                <button
                  onClick={handleSaveUsername}
                  className="text-green-400 hover:text-green-300 text-lg transition-all transform hover:scale-110"
                >
                  ✓
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 border border-white/10"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <span className="hidden md:inline text-white font-semibold group-hover:text-blue-300 transition-colors">
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

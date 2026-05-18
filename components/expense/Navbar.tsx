'use client'

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setUsername } from "@/redux/userSlice";
import { useState } from "react";

interface NavbarProps {
  activeTab: 'expense' | 'income';
  setActiveTab: (tab: 'expense' | 'income') => void;
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
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              💰 Finance Tracker
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-3 md:px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'expense'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="hidden sm:inline">Expenses</span>
              <span className="sm:hidden">💸</span>
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-3 md:px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'income'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="hidden sm:inline">Income</span>
              <span className="sm:hidden">💵</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="px-2 py-1 rounded bg-gray-700 text-white text-sm w-24 md:w-32"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                  autoFocus
                />
                <button
                  onClick={handleSaveUsername}
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  ✓
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-white font-medium">
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

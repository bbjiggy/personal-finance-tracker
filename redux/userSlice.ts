import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction, User, Budget } from "@/interfaces/interfaces";

const initialState: User = {
  expense: [],
  incomes: [],
  username: 'User',
  budgets: []
}

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addIncome(state, action: PayloadAction<Transaction>) {
      state.incomes.push(action.payload);
    },
    addExpenses(state, action: PayloadAction<Transaction>) {
      state.expense.push(action.payload);
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    deleteTransaction(state, action: PayloadAction<{ id: string; type: 'expense' | 'income' }>) {
      if (action.payload.type === 'expense') {
        state.expense = state.expense.filter(t => t.id !== action.payload.id);
      } else {
        state.incomes = state.incomes.filter(t => t.id !== action.payload.id);
      }
    },
    updateTransaction(state, action: PayloadAction<{ id: string; type: 'expense' | 'income'; data: Transaction }>) {
      if (action.payload.type === 'expense') {
        const index = state.expense.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.expense[index] = action.payload.data;
        }
      } else {
        const index = state.incomes.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.incomes[index] = action.payload.data;
        }
      }
    },
    addBudget(state, action: PayloadAction<Budget>) {
      state.budgets.push(action.payload);
    },
    updateBudget(state, action: PayloadAction<Budget>) {
      const index = state.budgets.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    deleteBudget(state, action: PayloadAction<string>) {
      state.budgets = state.budgets.filter(b => b.id !== action.payload);
    }
  }
});

export const { 
  addIncome, 
  addExpenses, 
  setUsername, 
  deleteTransaction, 
  updateTransaction,
  addBudget,
  updateBudget,
  deleteBudget
} = UserSlice.actions;
export default UserSlice.reducer;
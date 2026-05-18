import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction, User } from "@/interfaces/interfaces";

const initialState: User = {
  expense: [],
  incomes: [],
  username: 'User'
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
    }
  }
});

export const { addIncome, addExpenses, setUsername, deleteTransaction } = UserSlice.actions;
export default UserSlice.reducer;
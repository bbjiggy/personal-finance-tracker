export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Other';

export type IncomeCategory = 
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Business'
  | 'Gift'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  price: number;
  date: string;
  description: string;
  type: 'expense' | 'income';
  category: ExpenseCategory | IncomeCategory;
  tags: string[];
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  month: string; // Format: YYYY-MM
}

export interface User {
  expense: Transaction[];
  incomes: Transaction[];
  username: string;
  budgets: Budget[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}
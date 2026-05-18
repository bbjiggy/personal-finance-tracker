import { Transaction } from "@/interfaces/interfaces";

export const getNextRecurringDate = (
  lastDate: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
): string => {
  const date = new Date(lastDate);
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date.toISOString().split('T')[0];
};

export const shouldCreateRecurringTransaction = (
  transaction: Transaction,
  allTransactions: Transaction[]
): boolean => {
  if (!transaction.isRecurring || !transaction.recurringFrequency) {
    return false;
  }
  
  const nextDate = getNextRecurringDate(transaction.date, transaction.recurringFrequency);
  const today = new Date().toISOString().split('T')[0];
  
  if (nextDate > today) {
    return false;
  }
  
  const exists = allTransactions.some(
    t => t.title === transaction.title && 
         t.date === nextDate &&
         t.category === transaction.category
  );
  
  return !exists;
};

export const createRecurringTransaction = (
  baseTransaction: Transaction,
  newDate: string
): Transaction => {
  return {
    ...baseTransaction,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: newDate
  };
};

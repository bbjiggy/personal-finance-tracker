import { Transaction } from "@/interfaces/interfaces";

export const migrateTransaction = (transaction: any): Transaction => {
  return {
    ...transaction,
    category: transaction.category || 'Other',
    tags: transaction.tags || [],
    isRecurring: transaction.isRecurring || false,
    recurringFrequency: transaction.recurringFrequency || undefined
  };
};

export const migrateTransactions = (transactions: any[]): Transaction[] => {
  return transactions.map(migrateTransaction);
};

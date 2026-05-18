import { Transaction } from "@/interfaces/interfaces";

export const exportToCSV = (transactions: Transaction[], filename: string) => {
  const headers = ['Date', 'Title', 'Category', 'Amount', 'Type', 'Description', 'Tags'];
  
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      `"${t.title}"`,
      t.category,
      t.price,
      t.type,
      `"${t.description}"`,
      `"${t.tags.join(', ')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAllData = (expenses: Transaction[], incomes: Transaction[]) => {
  const allTransactions = [...expenses, ...incomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const date = new Date().toISOString().split('T')[0];
  exportToCSV(allTransactions, `finance-tracker-${date}.csv`);
};

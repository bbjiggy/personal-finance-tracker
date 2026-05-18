export interface Transaction {
  id: string;
  title: string;
  price: number;
  date: string;
  description: string;
  type: 'expense' | 'income';
}

export interface User {
  expense: Transaction[];
  incomes: Transaction[];
  username: string;
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
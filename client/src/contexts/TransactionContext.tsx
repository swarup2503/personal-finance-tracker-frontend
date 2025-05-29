import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchTransactions, 
  fetchSummary, 
  createTransaction, 
  deleteTransaction,
  exportCsv,
  exportPdf
} from '../services/transactionService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description?: string;
  userId: string;
  time?: string;
}

export interface TransactionSummary {
  income: number;
  expenses: number;
  balance: number;
}

export interface TransactionFilters {
  category?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  summary: TransactionSummary;
  loading: boolean;
  getTransactions: (filters?: TransactionFilters) => Promise<void>;
  getSummary: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, '_id' | 'userId'>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  downloadCsv: () => Promise<void>;
  downloadPdf: () => Promise<void>;
}

interface TransactionProviderProps {
  children: ReactNode;
}

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  summary: { income: 0, expenses: 0, balance: 0 },
  loading: false,
  getTransactions: async () => {},
  getSummary: async () => {},
  addTransaction: async () => {},
  removeTransaction: async () => {},
  downloadCsv: async () => {},
  downloadPdf: async () => {},
});

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({ income: 0, expenses: 0, balance: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const getTransactions = async (filters?: TransactionFilters) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await fetchTransactions(filters);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getSummary = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, '_id' | 'userId'>) => {
    setLoading(true);
    try {
      const newTransaction = await createTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      await getSummary(); // Update summary after adding a transaction
      toast.success('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const removeTransaction = async (id: string) => {
    setLoading(true);
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t._id !== id));
      await getSummary(); // Update summary after deleting a transaction
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async () => {
    try {
      await exportCsv();
      toast.success('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV');
    }
  };

  const downloadPdf = async () => {
    try {
      await exportPdf();
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getTransactions();
      getSummary();
    }
  }, [isAuthenticated]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        loading,
        getTransactions,
        getSummary,
        addTransaction,
        removeTransaction,
        downloadCsv,
        downloadPdf,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
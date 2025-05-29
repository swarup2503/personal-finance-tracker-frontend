import api from './api';
import { Transaction, TransactionSummary, TransactionFilters } from '../contexts/TransactionContext';

export const fetchTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
  const { data } = await api.get('/transactions', { params: filters });
  return data;
};

export const fetchSummary = async (): Promise<TransactionSummary> => {
  const { data } = await api.get('/transactions/summary');
  return data;
};

export const createTransaction = async (transaction: Omit<Transaction, '_id' | 'userId'>): Promise<Transaction> => {
  const { data } = await api.post('/transactions', transaction);
  return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const exportCsv = async (): Promise<void> => {
  const response = await api.get('/transactions/export/csv', {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportPdf = async (): Promise<void> => {
  const response = await api.get('/transactions/export/pdf', {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'transactions.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
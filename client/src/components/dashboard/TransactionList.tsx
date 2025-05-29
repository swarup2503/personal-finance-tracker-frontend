import { formatDistanceToNow } from 'date-fns';
import { Transaction } from '../../contexts/TransactionContext';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => Promise<void>;
  limit?: number;
}

const categoryIcons: Record<string, string> = {
  'Salary': '💼',
  'Freelance': '💻',
  'Investments': '📈',
  'Gifts': '🎁',
  'Food': '🍔',
  'Transportation': '🚗',
  'Housing': '🏠',
  'Entertainment': '🎬',
  'Healthcare': '🏥',
  'Education': '📚',
  'Shopping': '🛍️',
  'Utilities': '💡',
  'Other': '📋'
};

const TransactionList = ({ transactions, onDelete, limit }: TransactionListProps) => {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No transactions found</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {displayTransactions.map((transaction) => {
        const date = new Date(transaction.date);
        const formattedDate = formatDistanceToNow(date, { addSuffix: true });
        const isIncome = transaction.type === 'income';
        
        return (
          <li key={transaction._id} className="py-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={clsx(
                  'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center',
                  isIncome ? 'bg-success-100' : 'bg-danger-100'
                )}>
                  <span className="text-lg">
                    {categoryIcons[transaction.category] || '📋'}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{transaction.category}</p>
                  <p className="text-xs text-gray-500">
                    {transaction.description || 'No description'} • {formattedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={clsx(
                  'text-sm font-semibold mr-4',
                  isIncome ? 'text-success-600' : 'text-danger-600'
                )}>
                  {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => onDelete(transaction._id)}
                  className="text-gray-400 hover:text-danger-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TransactionList;
import { useState, FormEvent } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import { X } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
}

const categories = {
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'],
  expense: ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Utilities', 'Other']
};

const TransactionForm = ({ onClose }: TransactionFormProps) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { addTransaction, loading } = useTransactions();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount || !date) {
      return;
    }
    
    try {
      await addTransaction({
        type,
        category,
        amount: parseFloat(amount),
        description,
        date,
      });
      
      // Reset form
      setCategory('');
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md scale-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">Transaction Type</label>
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-lg border ${
                type === 'expense' 
                  ? 'bg-danger-100 border-danger-300 text-danger-700' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
              onClick={() => setType('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-lg border ${
                type === 'income' 
                  ? 'bg-success-100 border-success-300 text-success-700' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
              onClick={() => setType('income')}
            >
              Income
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select category</option>
            {categories[type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="form-label">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="form-label">Description (Optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input min-h-[80px]"
            placeholder="Add notes about this transaction..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
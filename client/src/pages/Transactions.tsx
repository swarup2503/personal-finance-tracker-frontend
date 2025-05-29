import { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import TransactionList from '../components/dashboard/TransactionList';
import TransactionForm from '../components/dashboard/TransactionForm';
import { Plus, Search, Filter, Download } from 'lucide-react';

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const { transactions, loading, removeTransaction, getTransactions, downloadCsv, downloadPdf } = useTransactions();

  const toggleForm = () => setShowForm(!showForm);
  const toggleFilters = () => setShowFilters(!showFilters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    getTransactions(filters);
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      startDate: '',
      endDate: ''
    });
    getTransactions();
  };

  // Get unique categories from transactions
  const categories = ['all', ...new Set(transactions.map(t => t.category))];

  // Filter transactions by search term (client-side search)
  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.category?.toLowerCase().includes(searchLower) ||
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <div className="flex space-x-2">
          <button 
            onClick={toggleFilters}
            className="btn btn-outline flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </button>
          <button 
            onClick={toggleForm}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add
          </button>
        </div>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={downloadCsv}
            className="btn btn-outline flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            CSV
          </button>
          <button 
            onClick={downloadPdf}
            className="btn btn-outline flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Filter Transactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="type" className="form-label">Type</label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="form-input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="form-label">From Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="form-label">To Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={resetFilters}
              className="btn btn-outline"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="btn btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">All Transactions</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <TransactionList 
            transactions={filteredTransactions} 
            onDelete={removeTransaction}
          />
        )}
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50">
          <TransactionForm onClose={toggleForm} />
        </div>
      )}
    </div>
  );
};

export default Transactions;
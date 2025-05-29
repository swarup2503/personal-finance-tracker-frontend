import { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import SummaryCard from '../components/dashboard/SummaryCard';
import TransactionList from '../components/dashboard/TransactionList';
import TransactionForm from '../components/dashboard/TransactionForm';
import DoughnutChart from '../components/charts/DoughnutChart';
import BarChart from '../components/charts/BarChart';
import { Plus, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const { transactions, summary, loading, removeTransaction, downloadCsv, downloadPdf } = useTransactions();

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button 
          onClick={toggleForm}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Balance" 
          amount={summary.balance} 
          type="balance" 
        />
        <SummaryCard 
          title="Total Income" 
          amount={summary.income} 
          type="income" 
          icon={<ArrowUpToLine className="h-6 w-6" />}
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={summary.expenses} 
          type="expense" 
          icon={<ArrowDownToLine className="h-6 w-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
          <BarChart transactions={transactions} />
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Expense Categories</h2>
          <DoughnutChart transactions={transactions} type="expense" />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <div className="flex space-x-2">
            <button 
              onClick={downloadCsv}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Export CSV
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={downloadPdf}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Export PDF
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <TransactionList 
            transactions={transactions} 
            onDelete={removeTransaction}
            limit={5}
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

export default Dashboard;
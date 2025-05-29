import { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import DoughnutChart from '../components/charts/DoughnutChart';
import BarChart from '../components/charts/BarChart';
import { Download, Filter } from 'lucide-react';

const Reports = () => {
  const [period, setPeriod] = useState('all');
  const [chartType, setChartType] = useState('expense');
  
  const { transactions, downloadCsv, downloadPdf } = useTransactions();

  // Filter transactions based on selected period
  const filteredTransactions = (() => {
    if (period === 'all') return transactions;
    
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
  })();

  // Calculate summary statistics
  const summary = filteredTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = summary.income - summary.expense;
  const savingsRate = summary.income > 0 ? ((summary.income - summary.expense) / summary.income) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
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

      {/* Period Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <label htmlFor="period" className="form-label">Time Period</label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="form-input w-full md:w-auto"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last month</option>
              <option value="quarter">Last 3 months</option>
              <option value="year">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div>
            <label htmlFor="chartType" className="form-label">Chart Type</label>
            <select
              id="chartType"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="form-input w-full md:w-auto"
            >
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-gray-500 text-sm">Total Income</h3>
          <p className="text-2xl font-semibold text-success-600">
            ₹{summary.income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Total Expenses</h3>
          <p className="text-2xl font-semibold text-danger-600">
            ₹{summary.expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Net Balance</h3>
          <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Savings Rate</h3>
          <p className={`text-2xl font-semibold ${savingsRate >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            {chartType === 'expense' ? 'Expense' : 'Income'} Breakdown
          </h2>
          <DoughnutChart 
            transactions={filteredTransactions}
            type={chartType as 'income' | 'expense'}
          />
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Monthly Trend</h2>
          <BarChart transactions={filteredTransactions} />
        </div>
      </div>
      
      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-primary-50 border-primary-100">
          <h2 className="text-lg font-semibold text-primary-700 mb-2">Financial Insights</h2>
          {balance < 0 ? (
            <p className="text-primary-800">
              You're spending more than you earn. Consider reducing expenses in your top spending categories.
            </p>
          ) : savingsRate < 20 ? (
            <p className="text-primary-800">
              Your savings rate is {savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of your income.
            </p>
          ) : (
            <p className="text-primary-800">
              Great job! You're saving {savingsRate.toFixed(1)}% of your income, which is above the recommended 20%.
            </p>
          )}
          <div className="mt-4 p-4 bg-white rounded-lg border border-primary-200">
            <p className="text-sm text-primary-700">
              📬 Daily Transaction Reports: You will receive a detailed transaction report every day at 8:00 AM IST on your registered email address. The report includes your daily summary and transaction details in PDF format.
            </p>
          </div>
        </div>
        
        <div className="card bg-success-50 border-success-100">
          <h2 className="text-lg font-semibold text-success-700 mb-2">Tips to Improve</h2>
          <ul className="list-disc pl-5 text-success-800 space-y-1">
            <li>Review recurring subscriptions regularly</li>
            <li>Set a budget for each category</li>
            <li>Track expenses daily</li>
            <li>Look for ways to increase your income</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
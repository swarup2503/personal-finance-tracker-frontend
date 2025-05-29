import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Transaction } from '../../contexts/TransactionContext';
import { useMemo } from 'react';

interface BarChartProps {
  transactions: Transaction[];
}

// Format date to Month abbreviation
const formatMonth = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { month: 'short' });
};

const BarChartComponent = ({ transactions }: BarChartProps) => {
  const data = useMemo(() => {
    // Group transactions by month
    const monthlyData = new Map<string, { month: string, income: number, expense: number }>();
    
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Process each transaction
    sortedTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = formatMonth(transaction.date);
      
      const current = monthlyData.get(monthYear) || { 
        month: monthName, 
        income: 0, 
        expense: 0 
      };
      
      if (transaction.type === 'income') {
        current.income += transaction.amount;
      } else {
        current.expense += transaction.amount;
      }
      
      monthlyData.set(monthYear, current);
    });
    
    // Convert to array and limit to last 6 months
    return Array.from(monthlyData.values())
      .slice(-6);
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No transaction data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `₹${value}`} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
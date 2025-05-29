import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction } from '../../contexts/TransactionContext';
import { useMemo } from 'react';

interface DoughnutChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
}

// Color palettes
const COLORS_EXPENSE = ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2', '#dc2626', '#b91c1c', '#991b1b'];
const COLORS_INCOME = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#059669', '#047857', '#065F46'];

const DoughnutChart = ({ transactions, type }: DoughnutChartProps) => {
  const data = useMemo(() => {
    // Filter transactions by type
    const filteredTransactions = transactions.filter(t => t.type === type);
    
    // Group by category and sum amounts
    const categoryMap = new Map<string, number>();
    
    filteredTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + transaction.amount);
    });
    
    // Convert to array for Recharts
    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions, type]);

  const colors = type === 'expense' ? COLORS_EXPENSE : COLORS_INCOME;
  
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No {type} transactions to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DoughnutChart;
import { ReactNode } from 'react';
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react';
import clsx from 'clsx';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon?: ReactNode;
}

const SummaryCard = ({ title, amount, type, icon }: SummaryCardProps) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'income':
        return {
          icon: icon || <ArrowUp className="h-6 w-6" />,
          bgColor: 'bg-success-100',
          textColor: 'text-success-600',
          amountColor: 'text-success-600'
        };
      case 'expense':
        return {
          icon: icon || <ArrowDown className="h-6 w-6" />,
          bgColor: 'bg-danger-100',
          textColor: 'text-danger-600',
          amountColor: 'text-danger-600'
        };
      case 'balance':
      default:
        return {
          icon: icon || <DollarSign className="h-6 w-6" />,
          bgColor: 'bg-primary-100',
          textColor: 'text-primary-600',
          amountColor: amount >= 0 ? 'text-success-600' : 'text-danger-600'
        };
    }
  };

  const { icon: displayIcon, bgColor, textColor, amountColor } = getIconAndColor();

  return (
    <div className="card hover:shadow-md transition-all">
      <div className="flex items-center">
        <div className={clsx('p-3 rounded-full mr-4', bgColor)}>
          <div className={textColor}>{displayIcon}</div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={clsx('text-2xl font-semibold', amountColor)}>
            ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
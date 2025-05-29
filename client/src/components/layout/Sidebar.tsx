import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Receipt, 
  FileText, 
  CreditCard 
} from 'lucide-react';
import clsx from 'clsx';
import { useTransactions } from '../../contexts/TransactionContext';

interface SidebarProps {
  onClose?: () => void;
}



const Sidebar = ({ onClose }: SidebarProps) => {
  
  const { downloadCsv, downloadPdf } = useTransactions();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Transactions', icon: Receipt, path: '/transactions' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center flex-shrink-0 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <CreditCard className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-semibold text-gray-800">Finance Tracker</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => clsx(
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all'
              )}
            >
              <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-gray-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Export Data</p>
            <div className="flex mt-1 space-x-2">
              <a
                href="#"
                onClick={
                  downloadCsv
                }
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                CSV
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="#"
                onClick={downloadPdf}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
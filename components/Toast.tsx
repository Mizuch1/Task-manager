import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-90/20 border-red-20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-90/20 border-yellow-20 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-20 dark:border-blue-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-sm ${getBgColor()}`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <p className={`text-sm ${type === 'success' ? 'text-green-800 dark:text-green-200' : 
          type === 'error' ? 'text-red-800 dark:text-red-200' :
          type === 'warning' ? 'text-yellow-800 dark:text-yellow-20' :
          'text-blue-800 dark:text-blue-200'}`}>
          {message}
        </p>
        <button 
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;

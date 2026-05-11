import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20',
    secondary: 'bg-white dark:bg-dark-900 text-slate-900 dark:text-dark-50 border border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800',
    ghost: 'bg-transparent text-slate-600 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20',
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={`btn ${variants[variant]} ${className} flex items-center justify-center gap-2`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;

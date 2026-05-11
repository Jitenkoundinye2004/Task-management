import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, X, Info, ExternalLink } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastItem = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const duration = 4000;
  const interval = 10;
  
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onRemove(toast.id);
          return 0;
        }
        return prev - (100 / (duration / interval));
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, toast.id, onRemove]);

  const handleClick = () => {
    if (toast.link) {
      navigate(toast.link);
      onRemove(toast.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      drag="x"
      dragConstraints={{ left: 0, right: 300 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onRemove(toast.id);
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={handleClick}
      className={`pointer-events-auto relative overflow-hidden flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border cursor-pointer group transition-all hover:scale-[1.02] active:scale-[0.98] ${
        toast.type === 'success' 
          ? 'bg-white dark:bg-dark-900 border-emerald-100 dark:border-emerald-900/30' 
          : toast.type === 'error'
          ? 'bg-white dark:bg-dark-900 border-red-100 dark:border-red-900/30'
          : 'bg-white dark:bg-dark-900 border-blue-100 dark:border-blue-900/30'
      }`}
    >
      <div className="flex items-center gap-3 pr-2">
        {toast.type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : toast.type === 'error' ? (
          <XCircle className="w-5 h-5 text-red-500" />
        ) : (
          <Info className="w-5 h-5 text-blue-500" />
        )}
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-dark-50">
            {toast.message}
          </p>
          {toast.link && (
            <p className="text-[10px] text-primary-500 flex items-center gap-1 mt-0.5 font-bold uppercase tracking-wider">
              Click to view <ExternalLink className="w-2 h-2" />
            </p>
          )}
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toast.id);
        }}
        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 transition-all ml-auto relative z-10"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-dark-800 w-full">
        <motion.div 
          className={`h-full transition-colors ${
            toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', link = null) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, link }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none w-full max-w-[320px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

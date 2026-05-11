import { Search, Bell, User as UserIcon, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { setSearchQuery } from '../redux/slices/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.ui);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 glass sticky top-0 z-30 flex items-center justify-between px-6 border-b-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1 max-w-md relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks, projects..." 
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-slate-100/50 dark:bg-dark-900/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          to="/notifications"
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 transition-all text-slate-500"
        >
          <Bell className="w-5 h-5" />
        </Link>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 transition-all text-slate-500"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-dark-800 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-dark-400 capitalize">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
            <UserIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

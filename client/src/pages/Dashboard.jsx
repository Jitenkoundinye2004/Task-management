import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const response = await axios.get('/api/projects/analytics', config);
        setAnalytics(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAnalytics();
  }, [user]);

  const stats = [
    { title: 'Total Projects', value: analytics?.totalProjects || 0, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { title: 'Completed Tasks', value: analytics?.completedTasks || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
    { title: 'Pending Tasks', value: analytics?.pendingTasks || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/20' },
    { title: 'Overdue Tasks', value: analytics?.overdueTasks || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-slate-800 dark:text-dark-50"
        >
          Welcome back, {user?.name.split(' ')[0]} 👋
        </motion.h1>
        <p className="text-slate-500 dark:text-dark-400 mt-1">
          Here's what's happening with your projects today.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-dark-400">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl h-80 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 dark:text-dark-50">Project Progress</h3>
          <div className="flex-1 flex items-center justify-center text-slate-400">
             Chart Visualization Coming Soon
          </div>
        </div>
        <div className="glass p-6 rounded-2xl h-80 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 dark:text-dark-50">Recent Activity</h3>
          <div className="flex-1 flex items-center justify-center text-slate-400">
             Log visualization coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

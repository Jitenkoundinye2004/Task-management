import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, MessageSquare, Briefcase, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, reset as resetNotifications } from '../redux/slices/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getNotifications());
    return () => dispatch(resetNotifications());
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case 'task': return { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'comment': return { icon: MessageSquare, color: 'text-primary-600', bg: 'bg-primary-100' };
      case 'deadline': return { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' };
      default: return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
    }
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-50">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-dark-400">Stay updated with your latest team activity.</p>
        </div>
        <button className="text-sm text-primary-600 font-medium hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const { icon: Icon, color, bg } = getIcon(notification.type);
            return (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-5 rounded-2xl flex gap-4 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`p-3 rounded-xl h-fit ${bg} ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-dark-50 group-hover:text-primary-600 transition-colors">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-400">{new Date(notification.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-dark-400 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;

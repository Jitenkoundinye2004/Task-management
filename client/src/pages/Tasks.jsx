import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, MessageSquare, Paperclip, Loader2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, updateTaskStatus, reset as resetTasks } from '../redux/slices/taskSlice';
import { getProjects } from '../redux/slices/projectSlice';
import { useToast } from '../context/ToastContext';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import axios from 'axios';

const Tasks = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: '',
  });

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { tasks, isLoading: isTasksLoading } = useSelector((state) => state.tasks);
  const { projects, isLoading: isProjectsLoading } = useSelector((state) => state.projects);
  const { searchQuery } = useSelector((state) => state.ui);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      dispatch(getTasks(selectedProjectId));
    }
  }, [selectedProjectId, dispatch]);

  const columns = [
    { id: 'Todo', title: 'To Do' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Review', title: 'Review' },
    { id: 'Completed', title: 'Completed' },
  ];

  const onStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };

  const onTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${projects[0].createdBy.token || useSelector(state => state.auth.user.token)}` },
      };
      // For now using simple axios since slice doesn't have createTask yet
      await axios.post('/api/tasks', { ...taskForm, project: selectedProjectId }, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
      });
      dispatch(getTasks(selectedProjectId));
      showToast('Task created successfully!', 'success', '/tasks');
      setIsModalOpen(false);
      setTaskForm({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create task', 'error');
      console.error(error);
    }
  };

  if (isProjectsLoading && projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-50">Task Board</h1>
          <div className="mt-2 flex items-center gap-3">
            <select 
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent border-none font-medium text-slate-600 focus:ring-0 cursor-pointer"
            >
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map(column => (
            <div key={column.id} className="w-80 flex flex-col bg-slate-100/50 dark:bg-dark-900/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-700 dark:text-dark-200">{column.title}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-dark-800 text-slate-500">
                    {filteredTasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {filteredTasks.filter(t => t.status === column.id).map((task, i) => (
                  <motion.div
                    key={task._id}
                    layoutId={task._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-4 rounded-xl shadow-sm cursor-pointer hover:border-primary-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        task.priority === 'Urgent' ? 'bg-red-100 text-red-600' : 
                        task.priority === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                      <select 
                        className="text-[10px] bg-transparent border-none p-0 focus:ring-0 text-slate-400"
                        value={task.status}
                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                      >
                        {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-dark-50 leading-snug">
                      {task.title}
                    </h4>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-dark-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-[10px] flex items-center justify-center text-primary-600 font-bold">
                          {task.assignedTo?.name?.charAt(0)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-dark-800 rounded-xl text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-dark-800 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
        <form onSubmit={onTaskSubmit} className="space-y-4">
          <Input 
            label="Task Title" 
            value={taskForm.title} 
            onChange={(e) => setTaskForm({...taskForm, title: e.target.value})} 
            required 
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="input min-h-[80px]"
              value={taskForm.description}
              onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <select 
                className="input"
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <Input 
              label="Due Date" 
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Assign To</label>
            <select 
              className="input"
              value={taskForm.assignedTo}
              onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
              required
            >
              <option value="">Select Member</option>
              {JSON.parse(localStorage.getItem('user')) && (
                <option value={JSON.parse(localStorage.getItem('user'))._id}>Me</option>
              )}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;

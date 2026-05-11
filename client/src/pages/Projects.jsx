import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Loader2, Trash2, Edit3 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, createProject, updateProject, deleteProject, reset as resetProjects } from '../redux/slices/projectSlice';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium',
  });

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { projects, isLoading, isError, message, isSuccess } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.ui);

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    dispatch(getProjects());
    return () => dispatch(resetProjects());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      showToast(isEditMode ? 'Project updated successfully!' : 'Project created successfully!', 'success', '/projects');
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingId(null);
      setFormData({ title: '', description: '', deadline: '', priority: 'Medium' });
    }
    if (isError) {
      showToast(message, 'error');
    }
    dispatch(resetProjects());
  }, [isSuccess, isError, message, dispatch, showToast, isEditMode]);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      dispatch(updateProject({ id: editingId, projectData: formData }));
    } else {
      dispatch(createProject(formData));
    }
  };

  const onEditClick = (project) => {
    setIsEditMode(true);
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
      priority: project.priority,
    });
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const onDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id));
      setActiveDropdown(null);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-50">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-dark-400">Manage and track all your team projects.</p>
        </div>
        {user?.role === 'Admin' && (
          <Button onClick={() => {
            setIsEditMode(false);
            setFormData({ title: '', description: '', deadline: '', priority: 'Medium' });
            setIsModalOpen(true);
          }} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <p className="text-slate-500">No projects found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4 relative">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 border border-primary-100 dark:border-primary-800/30">
                  Active
                </span>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === project._id ? null : project._id);
                    }}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-400 hover:text-slate-600 transition-all"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === project._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-dark-800 z-50 overflow-hidden"
                      >
                        <div className="p-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditClick(project);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-dark-300 hover:bg-slate-50 dark:hover:bg-dark-800 transition-all text-left"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Project
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(project._id);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Project
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-dark-50 mb-2 truncate">
                {project.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-dark-400 mb-6 line-clamp-2 min-h-[40px]">
                {project.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-slate-800 dark:text-dark-50">0%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 dark:border-dark-800 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-900 bg-slate-100 dark:bg-dark-800 flex items-center justify-center text-[10px] font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  project.priority === 'High' ? 'text-red-500 bg-red-50 dark:bg-red-900/10' : 
                  project.priority === 'Medium' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/10' : 
                  'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
                }`}>
                  Priority: {project.priority}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Project" : "Create New Project"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input 
            label="Project Title" 
            name="title"
            placeholder="e.g. Website Redesign" 
            value={formData.title}
            onChange={onChange}
            required 
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              name="description"
              className="input min-h-[100px]"
              placeholder="Describe the project goals..."
              value={formData.description}
              onChange={onChange}
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Deadline" 
              name="deadline"
              type="date" 
              value={formData.deadline}
              onChange={onChange}
              required
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <select 
                name="priority"
                className="input"
                value={formData.priority}
                onChange={onChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>{isEditMode ? "Update Project" : "Create Project"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, MoreVertical, UserPlus, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, reset as resetUsers } from '../redux/slices/userSlice';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const Team = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: 'Member'
  });

  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers());
    return () => dispatch(resetUsers());
  }, [dispatch]);

  const onInviteSubmit = (e) => {
    e.preventDefault();
    // Simulate invitation
    console.log('Inviting member:', inviteData);
    setIsModalOpen(false);
    setInviteData({ name: '', email: '', role: 'Member' });
    // In a real app, this would hit an /api/users/invite endpoint
  };

  if (isLoading && users.length === 0) {
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-50">Team Management</h1>
          <p className="text-sm text-slate-500 dark:text-dark-400">Manage your team members and their roles.</p>
        </div>
        {currentUser?.role === 'Admin' && (
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </Button>
        )}
      </div>

      <div className="glass rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-dark-900/50 border-b border-slate-100 dark:border-dark-800">
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
            {users.map((member, index) => (
              <motion.tr 
                key={member._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50/50 dark:hover:bg-dark-900/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-dark-50">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Shield className={`w-3.5 h-3.5 ${member.role === 'Admin' ? 'text-primary-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-medium ${member.role === 'Admin' ? 'text-primary-600' : 'text-slate-600'}`}>
                      {member.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-400 hover:text-slate-600 transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Team Member">
        <form onSubmit={onInviteSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="e.g. John Doe"
            value={inviteData.name}
            onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
            required
          />
          <Input 
            label="Email Address" 
            type="email"
            placeholder="john@example.com"
            value={inviteData.email}
            onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
            required
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Role</label>
            <select 
              className="input"
              value={inviteData.role}
              onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;

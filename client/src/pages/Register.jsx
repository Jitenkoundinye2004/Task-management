import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { register, reset } from '../redux/slices/authSlice';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member',
  });

  const { name, email, password, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-500 dark:text-dark-400 mt-2">
              Join the team and start collaborating
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={onChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={onChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={onChange}
              required
            />
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-300">
                Register as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'Member'})}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    role === 'Member' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600' 
                    : 'border-slate-200 dark:border-dark-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-dark-800'
                  }`}
                >
                  Team Member
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'Admin'})}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    role === 'Admin' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600' 
                    : 'border-slate-200 dark:border-dark-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-dark-800'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {isError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm p-3 rounded-lg text-center border border-red-200 dark:border-red-900/30">
                {message}
              </div>
            )}

            <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
              Sign Up
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-dark-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

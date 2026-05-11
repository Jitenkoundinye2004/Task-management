import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { addProject } from '../redux/slices/projectSlice';
import { updateLocalTask } from '../redux/slices/taskSlice';
import { getNotifications } from '../redux/slices/notificationSlice';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const newSocket = io(window.location.origin, {
        path: '/socket.io',
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join', user._id);
      });

      // Global event listeners
      newSocket.on('projectCreated', (project) => {
        dispatch(addProject(project));
      });

      newSocket.on('taskUpdated', (task) => {
        dispatch(updateLocalTask(task));
      });

      newSocket.on('notificationReceived', () => {
        dispatch(getNotifications());
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

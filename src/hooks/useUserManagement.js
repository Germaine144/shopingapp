import { useState } from 'react';
import api from '../api/axiosInstance';

export const useUserManagement = () => {
  const [loading, setLoading] = useState(false);

  // Fetch users with params (limit, skip, sortBy, order)
  const getUsers = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params });
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // Search Users
  const searchUsers = async (query) => {
    const res = await api.get(`/users/search?q=${query}`);
    return res.data;
  };

  // Add User (POST)
  const addUser = async (userData) => {
    const res = await api.post('/users/add', userData);
    alert(`User ${res.data.firstName} created (Simulated)`);
    return res.data;
  };

  // Update User (PUT)
  const updateUser = async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    alert('User updated (Simulated)');
    return res.data;
  };

  // Delete User (DELETE)
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    alert('User deleted (Simulated)');
  };

  return { getUsers, searchUsers, addUser, updateUser, deleteUser, loading };
};
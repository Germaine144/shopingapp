import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../common/LoadingSpinner';

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Users (Initial load or Search)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Use the search endpoint if there is a search term, else get all
        const url = searchTerm 
          ? `/users/search?q=${searchTerm}` 
          : '/users?limit=10';
        const res = await api.get(url);
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500); // Wait 500ms after typing to call API

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      alert("User deleted (simulated)");
    }
  };

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div style={styles.header}>
        <h3>👥 User Administration</h3>
        <input 
          type="text" 
          placeholder="Search by name (e.g. John)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={styles.row}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.gender}</td>
              <td>
                <button onClick={() => handleDelete(u.id)} style={styles.delBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
  input: { padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white' },
  row: { borderBottom: '1px solid #eee' },
  delBtn: { background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }
};

export default UserSection;
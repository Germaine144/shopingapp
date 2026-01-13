import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/axiosInstance';
import { 
  Package, Users, ShoppingCart, Edit, Trash2, 
  Plus, Search, X, LogOut, UserCheck, Save, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Product Modal Component
const AddProductModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add New Product</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

// Edit Product Modal Component
const EditProductModal = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: product.title || '',
    description: product.description || '',
    price: product.price || '',
    category: product.category || '',
    brand: product.brand || '',
    stock: product.stock || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Edit Product</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

// Add/Edit User Modal Component
const UserModal = ({ user, onClose, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    password: user?.password || '',
    phone: user?.phone || '',
    image: user?.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      onSubmit(user.id, formData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{isEdit ? 'Edit User' : 'Add New User'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              disabled={isEdit}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            {isEdit ? 'Update User' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const [apiUsers, setApiUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalApiUsers: 0,
    totalRegisteredUsers: 0,
    totalCarts: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddApiUserModal, setShowAddApiUserModal] = useState(false);
  const [editingApiUser, setEditingApiUser] = useState(null);
  const [showAddRegisteredUserModal, setShowAddRegisteredUserModal] = useState(false);
  const [editingRegisteredUser, setEditingRegisteredUser] = useState(null);
  
  // ✅ Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Load local products from localStorage
  const loadLocalProducts = () => {
    try {
      const products = JSON.parse(localStorage.getItem('localProducts') || '[]');
      setLocalProducts(products);
      return products;
    } catch (error) {
      console.error('Error loading local products:', error);
      return [];
    }
  };

  // Save local products to localStorage
  const saveLocalProducts = (products) => {
    try {
      localStorage.setItem('localProducts', JSON.stringify(products));
      setLocalProducts(products);
    } catch (error) {
      console.error('Error saving local products:', error);
    }
  };

  // Load registered users from localStorage
  const loadRegisteredUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      setRegisteredUsers(users);
      return users;
    } catch (error) {
      console.error('Error loading registered users:', error);
      return [];
    }
  };

  // Save registered users to localStorage
  const saveRegisteredUsers = (users) => {
    try {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      setRegisteredUsers(users);
    } catch (error) {
      console.error('Error saving registered users:', error);
      showError('Failed to save users');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, usersRes, cartsRes] = await Promise.all([
        api.getAllProducts({ limit: 10 }),
        api.getAllUsers({ limit: 10 }),
        api.getAllCarts({ limit: 10 }),
      ]);

      const localUsers = loadRegisteredUsers();
      const localProds = loadLocalProducts();

      setProducts(productsRes.data.products || []);
      setApiUsers(usersRes.data.users || []);
      
      setStats({
        totalProducts: (productsRes.data.total || 0) + localProds.length,
        totalApiUsers: usersRes.data.total || 0,
        totalRegisteredUsers: localUsers.length,
        totalCarts: cartsRes.data.total || 0,
      });
      
      setCarts(cartsRes.data.carts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Check if product is local
  const isLocalProduct = (productId) => {
    return localProducts.some(p => p.id === productId);
  };

  // ==================== PRODUCT CRUD ====================
  
  const handleAddProduct = async (productData) => {
    try {
      const newProduct = {
        id: `local-${Date.now()}`,
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        thumbnail: 'https://via.placeholder.com/150',
        rating: 0,
        createdAt: new Date().toISOString(),
        isLocal: true,
      };
      
      const updatedLocalProducts = [newProduct, ...localProducts];
      saveLocalProducts(updatedLocalProducts);
      
      success(`Product "${productData.title}" added successfully!`);
      setStats({...stats, totalProducts: stats.totalProducts + 1});
      setShowAddProductModal(false);
    } catch (error) {
      console.error('Add product error:', error);
      showError('Failed to add product');
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      if (isLocalProduct(productId)) {
        const updatedLocalProducts = localProducts.map(p => 
          p.id === productId ? { 
            ...p, 
            ...productData, 
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
            updatedAt: new Date().toISOString() 
          } : p
        );
        saveLocalProducts(updatedLocalProducts);
        success(`Product "${productData.title}" updated successfully!`);
        setEditingProduct(null);
      } else {
        const response = await api.updateProduct(productId, productData);
        
        if (response.data) {
          setProducts(products.map(p => 
            p.id === productId ? { ...p, ...productData } : p
          ));
          success(`Product "${productData.title}" updated successfully!`);
          setEditingProduct(null);
        }
      }
    } catch (error) {
      console.error('Update product error:', error);
      showError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId, productTitle) => {
    // ✅ Show confirmation modal instead of window.confirm
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          if (isLocalProduct(productId)) {
            const updatedLocalProducts = localProducts.filter(p => p.id !== productId);
            saveLocalProducts(updatedLocalProducts);
            setStats({...stats, totalProducts: Math.max(0, stats.totalProducts - 1)});
            success(`Product "${productTitle}" deleted successfully!`);
          } else {
            await api.deleteProduct(productId);
            setProducts(products.filter(p => p.id !== productId));
            setStats({...stats, totalProducts: Math.max(0, stats.totalProducts - 1)});
            success(`Product "${productTitle}" deleted successfully!`);
          }
        } catch (error) {
          console.error('Delete product error:', error);
          showError('Failed to delete product');
        }
      }
    });
  };

  // ==================== API USER CRUD ====================
  
  const handleAddApiUser = async (userData) => {
    try {
      const response = await api.addUser(userData);
      
      if (response.data) {
        success(`User "${userData.firstName} ${userData.lastName}" added successfully!`);
        setApiUsers([response.data, ...apiUsers]);
        setStats({...stats, totalApiUsers: stats.totalApiUsers + 1});
        setShowAddApiUserModal(false);
      }
    } catch (error) {
      console.error('Add user error:', error);
      showError('Failed to add user');
    }
  };

  const handleUpdateApiUser = async (userId, userData) => {
    try {
      const response = await api.updateUser(userId, userData);
      
      if (response.data) {
        setApiUsers(apiUsers.map(u => 
          u.id === userId ? { ...u, ...userData } : u
        ));
        success(`User "${userData.firstName} ${userData.lastName}" updated successfully!`);
        setEditingApiUser(null);
      }
    } catch (error) {
      console.error('Update user error:', error);
      showError('Failed to update user');
    }
  };

  const handleDeleteApiUser = async (userId, userName) => {
    // ✅ Show confirmation modal
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await api.deleteUser(userId);
          setApiUsers(apiUsers.filter(u => u.id !== userId));
          setStats({...stats, totalApiUsers: Math.max(0, stats.totalApiUsers - 1)});
          success(`User "${userName}" deleted successfully!`);
        } catch (error) {
          console.error('Delete user error:', error);
          showError('Failed to delete user');
        }
      }
    });
  };

  // ==================== REGISTERED USER CRUD ====================
  
  const handleAddRegisteredUser = (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        role: 'user',
      };
      
      const updatedUsers = [newUser, ...registeredUsers];
      saveRegisteredUsers(updatedUsers);
      setStats({...stats, totalRegisteredUsers: updatedUsers.length});
      success(`User "${userData.firstName} ${userData.lastName}" added successfully!`);
      setShowAddRegisteredUserModal(false);
    } catch (error) {
      console.error('Add registered user error:', error);
      showError('Failed to add user');
    }
  };

  const handleUpdateRegisteredUser = (userId, userData) => {
    try {
      const updatedUsers = registeredUsers.map(u => 
        u.id === userId ? { ...u, ...userData, updatedAt: new Date().toISOString() } : u
      );
      saveRegisteredUsers(updatedUsers);
      success(`User "${userData.firstName} ${userData.lastName}" updated successfully!`);
      setEditingRegisteredUser(null);
    } catch (error) {
      console.error('Update registered user error:', error);
      showError('Failed to update user');
    }
  };

  const handleDeleteRegisteredUser = (userId, userName) => {
    // ✅ Show confirmation modal
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      onConfirm: () => {
        try {
          const updatedUsers = registeredUsers.filter(u => u.id !== userId);
          saveRegisteredUsers(updatedUsers);
          setStats({...stats, totalRegisteredUsers: updatedUsers.length});
          success(`User "${userName}" deleted successfully!`);
        } catch (error) {
          console.error('Delete error:', error);
          showError('Failed to delete user');
        }
      }
    });
  };

  // ==================== CART MANAGEMENT ====================
  
  const handleDeleteCart = async (cartId) => {
    // ✅ Show confirmation modal
    setConfirmModal({
      isOpen: true,
      title: 'Delete Cart',
      message: `Are you sure you want to delete Cart #${cartId}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await api.deleteCart(cartId);
          setCarts(carts.filter(c => c.id !== cartId));
          setStats({...stats, totalCarts: Math.max(0, stats.totalCarts - 1)});
          success(`Cart #${cartId} deleted successfully!`);
        } catch (error) {
          console.error('Delete cart error:', error);
          showError('Failed to delete cart');
        }
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const allProducts = [...localProducts, ...products];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      {/* Other Modals */}
      {showAddProductModal && (
        <AddProductModal
          onClose={() => setShowAddProductModal(false)}
          onSubmit={handleAddProduct}
        />
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleUpdateProduct}
        />
      )}
      {showAddApiUserModal && (
        <UserModal
          onClose={() => setShowAddApiUserModal(false)}
          onSubmit={handleAddApiUser}
          isEdit={false}
        />
      )}
      {editingApiUser && (
        <UserModal
          user={editingApiUser}
          onClose={() => setEditingApiUser(null)}
          onSubmit={handleUpdateApiUser}
          isEdit={true}
        />
      )}
      {showAddRegisteredUserModal && (
        <UserModal
          onClose={() => setShowAddRegisteredUserModal(false)}
          onSubmit={handleAddRegisteredUser}
          isEdit={false}
        />
      )}
      {editingRegisteredUser && (
        <UserModal
          user={editingRegisteredUser}
          onClose={() => setEditingRegisteredUser(null)}
          onSubmit={handleUpdateRegisteredUser}
          isEdit={true}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.firstName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <Package className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">API Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalApiUsers}</p>
              </div>
              <Users className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Registered</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRegisteredUsers}</p>
              </div>
              <UserCheck className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Carts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCarts}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {['Products', 'API Users', 'Registered Users', 'Carts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.toLowerCase().replace(' ', '-')
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Products Management</h2>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Product</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Price</th>
                        <th className="text-left py-3 px-4">Stock</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={product.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
                              <span className="font-medium">{product.title}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">{product.category}</td>
                          <td className="py-4 px-4 font-medium">${product.price}</td>
                          <td className="py-4 px-4">{product.stock}</td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.title)}
                                className="p-2 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* API USERS TAB */}
            {activeTab === 'api-users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">API Users Management</h2>
                  <button
                    onClick={() => setShowAddApiUserModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiUsers.map((apiUser) => (
                        <tr key={apiUser.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={apiUser.image} alt="" className="w-10 h-10 rounded-full" />
                              <div>
                                <p className="font-medium">{apiUser.firstName} {apiUser.lastName}</p>
                                <p className="text-sm text-gray-500">@{apiUser.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">{apiUser.email}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 text-xs bg-gray-100 rounded-full">{apiUser.role || 'user'}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingApiUser(apiUser)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteApiUser(apiUser.id, `${apiUser.firstName} ${apiUser.lastName}`)}
                                className="p-2 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REGISTERED USERS TAB */}
            {activeTab === 'registered-users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Registered Users</h2>
                  <button
                    onClick={() => setShowAddRegisteredUserModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>
                {registeredUsers.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No registered users yet</p>
                    <button
                      onClick={() => setShowAddRegisteredUserModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                      Add First User
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">User</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Joined</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredUsers.map((regUser) => (
                          <tr key={regUser.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <img src={regUser.image} alt="" className="w-10 h-10 rounded-full" />
                                <div>
                                  <p className="font-medium">{regUser.firstName} {regUser.lastName}</p>
                                  <p className="text-sm text-gray-500">@{regUser.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">{regUser.email}</td>
                            <td className="py-4 px-4">{new Date(regUser.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingRegisteredUser(regUser)}
                                  className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRegisteredUser(regUser.id, `${regUser.firstName} ${regUser.lastName}`)}
                                  className="p-2 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* CARTS TAB */}
            {activeTab === 'carts' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Carts Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Cart ID</th>
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Items</th>
                        <th className="text-left py-3 px-4">Total</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carts.map((cart) => (
                        <tr key={cart.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium">#{cart.id}</td>
                          <td className="py-4 px-4">User #{cart.userId}</td>
                          <td className="py-4 px-4">{cart.totalProducts}</td>
                          <td className="py-4 px-4 font-medium">${cart.total}</td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleDeleteCart(cart.id)}
                                className="p-2 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
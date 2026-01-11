import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('https://dummyjson.com/auth/refresh', {
          refreshToken,
          expiresInMins: 30,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API methods for all endpoints
export const api = {
  // ==================== AUTHENTICATION ====================
  
  // Login user
  login: (username, password, expiresInMins = 30) => 
    axios.post('https://dummyjson.com/auth/login', {
      username,
      password,
      expiresInMins,
    }),
  
  // Get current authenticated user
  getCurrentUser: () => 
    axiosInstance.get('/auth/me', {
      credentials: 'include'
    }),
  
  // Refresh access token
  refreshToken: (refreshToken, expiresInMins = 30) => 
    axios.post('https://dummyjson.com/auth/refresh', {
      refreshToken,
      expiresInMins,
    }),

  // ==================== PRODUCTS ====================
  
  // Get all products with optional pagination, sorting, and field selection
  getAllProducts: (params = {}) => axiosInstance.get('/products', { params }),
  
  // Get single product by ID
  getProductById: (id) => axiosInstance.get(`/products/${id}`),
  
  // Search products
  searchProducts: (query, params = {}) => 
    axiosInstance.get(`/products/search?q=${query}`, { params }),
  
  // Get all categories
  getCategories: () => axiosInstance.get('/products/categories'),
  
  // Get products by category
  getProductsByCategory: (category, params = {}) => 
    axiosInstance.get(`/products/category/${category}`, { params }),
  
  // Get category list (alternative endpoint)
  getCategoryList: () => axiosInstance.get('/products/category-list'),
  
  // Get products with pagination
  getProductsPaginated: (limit = 10, skip = 0, select = '') => {
    const params = { limit, skip };
    if (select) params.select = select;
    return axiosInstance.get('/products', { params });
  },
  
  // Get sorted products
  getSortedProducts: (sortBy = 'title', order = 'asc') => 
    axiosInstance.get('/products', { params: { sortBy, order } }),

  // Add new product (Admin)
  addProduct: (productData) => 
    axiosInstance.post('/products/add', productData),

  // Update product (Admin)
  updateProduct: (id, productData) => 
    axiosInstance.put(`/products/${id}`, productData),

  // Partially update product (Admin)
  patchProduct: (id, productData) => 
    axiosInstance.patch(`/products/${id}`, productData),

  // Delete product (Admin)
  deleteProduct: (id) => 
    axiosInstance.delete(`/products/${id}`),

  // ==================== USERS ====================
  
  // Get all users
  getAllUsers: (params = {}) => axiosInstance.get('/users', { params }),
  
  // Get single user by ID
  getUserById: (id) => axiosInstance.get(`/users/${id}`),
  
  // Search users
  searchUsers: (query, params = {}) => 
    axiosInstance.get(`/users/search?q=${query}`, { params }),
  
  // Filter users
  filterUsers: (key, value) => 
    axiosInstance.get(`/users/filter?key=${key}&value=${value}`),
  
  // Get users with pagination
  getUsersPaginated: (limit = 10, skip = 0, select = '') => {
    const params = { limit, skip };
    if (select) params.select = select;
    return axiosInstance.get('/users', { params });
  },
  
  // Add new user
  addUser: (userData) => 
    axiosInstance.post('/users/add', userData),
  
  // Update user
  updateUser: (id, userData) => 
    axiosInstance.put(`/users/${id}`, userData),
  
  // Partially update user
  patchUser: (id, userData) => 
    axiosInstance.patch(`/users/${id}`, userData),
  
  // Delete user
  deleteUser: (id) => 
    axiosInstance.delete(`/users/${id}`),

  // ==================== CARTS ====================
  
  // Get all carts
  getAllCarts: (params = {}) => axiosInstance.get('/carts', { params }),
  
  // Get single cart by ID
  getCartById: (id) => axiosInstance.get(`/carts/${id}`),
  
  // Get user's carts
  getUserCarts: (userId) => axiosInstance.get(`/carts/user/${userId}`),
  
  // Add new cart
  addCart: (cartData) => axiosInstance.post('/carts/add', cartData),
  
  // Update cart
  updateCart: (id, cartData) => axiosInstance.put(`/carts/${id}`, cartData),
  
  // Delete cart
  deleteCart: (id) => axiosInstance.delete(`/carts/${id}`),
};

// Export axios instance for custom requests
export default axiosInstance;
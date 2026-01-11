import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const api = {
  // ==================== PRODUCTS ====================
  getAllProducts: (params = {}) => {
    return axiosInstance.get('/products', { params });
  },

  getProduct: (id) => {
    return axiosInstance.get(`/products/${id}`);
  },

  searchProducts: (query) => {
    return axiosInstance.get(`/products/search?q=${query}`);
  },

  getProductsByCategory: (category) => {
    return axiosInstance.get(`/products/category/${category}`);
  },

  getCategories: () => {
    return axiosInstance.get('/products/categories');
  },

  addProduct: (productData) => {
    return axiosInstance.post('/products/add', productData);
  },

  updateProduct: (id, productData) => {
    return axiosInstance.put(`/products/${id}`, productData);
  },

  deleteProduct: (id) => {
    return axiosInstance.delete(`/products/${id}`);
  },

  // ==================== USERS ====================
  getAllUsers: (params = {}) => {
    return axiosInstance.get('/users', { params });
  },

  getUser: (id) => {
    return axiosInstance.get(`/users/${id}`);
  },

  searchUsers: (query) => {
    return axiosInstance.get(`/users/search?q=${query}`);
  },

  addUser: (userData) => {
    return axiosInstance.post('/users/add', userData);
  },

  updateUser: (id, userData) => {
    return axiosInstance.put(`/users/${id}`, userData);
  },

  deleteUser: (id) => {
    return axiosInstance.delete(`/users/${id}`);
  },

  // ==================== AUTH ====================
  login: (credentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },

  getCurrentUser: () => {
    return axiosInstance.get('/auth/me');
  },

  refreshToken: (refreshToken) => {
    return axiosInstance.post('/auth/refresh', { refreshToken });
  },

  // ==================== CARTS ====================
  getAllCarts: (params = {}) => {
    return axiosInstance.get('/carts', { params });
  },

  getCart: (id) => {
    return axiosInstance.get(`/carts/${id}`);
  },

  getUserCarts: (userId) => {
    return axiosInstance.get(`/carts/user/${userId}`);
  },

  addCart: (cartData) => {
    return axiosInstance.post('/carts/add', cartData);
  },

  updateCart: (id, cartData) => {
    return axiosInstance.put(`/carts/${id}`, cartData);
  },

  deleteCart: (id) => {
    return axiosInstance.delete(`/carts/${id}`);
  },

  // ==================== POSTS ====================
  getAllPosts: (params = {}) => {
    return axiosInstance.get('/posts', { params });
  },

  getPost: (id) => {
    return axiosInstance.get(`/posts/${id}`);
  },

  getUserPosts: (userId) => {
    return axiosInstance.get(`/posts/user/${userId}`);
  },

  addPost: (postData) => {
    return axiosInstance.post('/posts/add', postData);
  },

  updatePost: (id, postData) => {
    return axiosInstance.put(`/posts/${id}`, postData);
  },

  deletePost: (id) => {
    return axiosInstance.delete(`/posts/${id}`);
  },

  // ==================== COMMENTS ====================
  getAllComments: (params = {}) => {
    return axiosInstance.get('/comments', { params });
  },

  getPostComments: (postId) => {
    return axiosInstance.get(`/comments/post/${postId}`);
  },

  addComment: (commentData) => {
    return axiosInstance.post('/comments/add', commentData);
  },

  updateComment: (id, commentData) => {
    return axiosInstance.put(`/comments/${id}`, commentData);
  },

  deleteComment: (id) => {
    return axiosInstance.delete(`/comments/${id}`);
  },
};

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
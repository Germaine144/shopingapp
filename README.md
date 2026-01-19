# 🛍️ E-Commerce Shop Application

A modern, full-featured e-commerce web application built with React, featuring user authentication, product browsing, shopping cart, and admin dashboard.

![React](https://img.shields.io/badge/React-18.x-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245)

## 📋 Table of Contents

- [Features](#features)
- [Demo Credentials](#demo-credentials)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- 🔐 **User Authentication** - Login, Register, and Logout functionality
- 🛒 **Shopping Cart** - Add, remove, and update product quantities
- 📦 **Product Browsing** - View products with search and filter options
- 👤 **User Profile** - View and edit profile information
- 💳 **Checkout Process** - Complete purchase workflow
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔍 **Product Search** - Real-time product search
- 🏷️ **Category Filtering** - Browse products by category

### Admin Features
- 📊 **Admin Dashboard** - Overview of store statistics
- ➕ **Product Management** - Add, edit, and delete products
- 👥 **User Management** - View and manage users
- 📈 **Analytics** - Sales and performance metrics
- 🛡️ **Protected Routes** - Role-based access control

## 🔑 Demo Credentials

### Admin Access
```
Username: admin
Password: admin123
```

### Regular User (DummyJSON API)
```
Username: emilys
Password: emilyspass
```

### Local Registration
You can also create your own account using the registration form.

## 🛠️ Tech Stack

### Frontend
- **React** (18.x) - JavaScript library for building user interfaces
- **React Router DOM** (6.x) - Client-side routing
- **Tailwind CSS** (3.x) - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API requests

### State Management
- **React Context API** - Global state management for authentication and cart

### API
- **DummyJSON API** - Mock REST API for products and authentication
- **Local Storage** - Persistent storage for cart and user data

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ecommerce-shop.git
cd ecommerce-shop
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm start
# or
yarn start
```

4. **Open your browser**
```
Navigate to http://localhost:3000
```

## 📁 Project Structure

```
ecommerce-shop/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── axiosInstance.js      # Axios configuration and API calls
│   ├── components/
│   │   ├── Login.jsx              # Login page component
│   │   ├── Register.jsx           # Registration page component
│   │   ├── Home.jsx               # Home/Products page
│   │   ├── ProductCard.jsx        # Product display card
│   │   ├── Cart.jsx               # Shopping cart page
│   │   ├── Checkout.jsx           # Checkout page
│   │   ├── Profile.jsx            # User profile page
│   │   ├── Navbar.jsx             # Navigation bar
│   │   └── ProtectedRoute.jsx     # Route protection wrapper
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication state management
│   │   └── CartContext.jsx        # Shopping cart state management
│   ├── pages/
│   │   ├── Dashboard.jsx          # Admin dashboard
│   │   └── ProductManagement.jsx  # Admin product management
│   ├── App.js                     # Main application component
│   ├── index.js                   # Application entry point
│   └── index.css                  # Global styles and Tailwind imports
├── package.json
├── tailwind.config.js             # Tailwind CSS configuration
└── README.md
```

## 🚀 Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

## 🔐 Authentication

The application uses a multi-layered authentication system:

### 1. Admin Login
- Hardcoded credentials for admin access
- Full access to admin dashboard and management features

### 2. API Login (DummyJSON)
- Integrates with DummyJSON API for demo users
- Real-time authentication validation
- Token-based session management

### 3. Local Registration
- Users can create accounts locally
- Data stored in browser's localStorage
- Password validation and form validation

### Authentication Flow
```javascript
Login Attempt
    ↓
Check if Admin credentials
    ↓ (if not)
Try DummyJSON API
    ↓ (if fails)
Check Local registered users
    ↓ (if not found)
Return error
```

## 🌐 API Integration

### DummyJSON Endpoints Used

```javascript
// Authentication
POST /auth/login
GET /auth/me

// Products
GET /products
GET /products/{id}
GET /products/search?q={query}
GET /products/category/{category}

// Categories
GET /products/categories
```

### Custom API Instance (axiosInstance.js)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

## 🛡️ Protected Routes

The application uses route protection to restrict access:

```javascript
// Admin-only routes
<Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />

// User authentication required
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
```

## 🎨 Styling

The application uses **Tailwind CSS** for styling:

- Utility-first approach
- Responsive design breakpoints
- Custom color scheme
- Dark mode support (optional)

### Color Scheme
```javascript
Primary: Gray-900 (#111827)
Secondary: Gray-600 (#4B5563)
Accent: Gray-100 (#F3F4F6)
Error: Red-600 (#DC2626)
Success: Green-600 (#059669)
```

## 🔧 Configuration

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#111827',
        secondary: '#4B5563',
      },
    },
  },
  plugins: [],
}
```

### Environment Variables (Optional)
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://dummyjson.com
REACT_APP_ADMIN_USERNAME=admin
REACT_APP_ADMIN_PASSWORD=admin123
```

## 🐛 Troubleshooting

### Browser keeps loading / App won't start
1. Clear browser localStorage:
   - Open DevTools (F12)
   - Application → Local Storage → Clear
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: 
   ```bash
   rm -rf node_modules
   npm install
   ```

### Login not working
1. Check console for API errors
2. Verify you're using correct credentials
3. Check if DummyJSON API is accessible
4. Try clearing localStorage and logging in again

### Products not loading
1. Check internet connection
2. Verify DummyJSON API status
3. Check browser console for CORS errors
4. Try refreshing the page

## 📝 Features Roadmap

- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Order history
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use functional components and hooks
- Follow ESLint configuration
- Write clean, commented code
- Use meaningful variable names
- Test before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) - Free fake REST API
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React](https://reactjs.org/) - JavaScript library

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact via email
- Check existing documentation

---

**Happy Shopping! 🛒**

Made with ❤️ using React and Tailwind CSS
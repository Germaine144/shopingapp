import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

const Navbar = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const { cart, wishlist } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="logo">
        <Link to="/" style={styles.logoText}>🚀 E-Shop</Link>
      </div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/cart" style={styles.link}>
          🛒 Cart ({cart.length})
        </Link>
        <Link to="/wishlist" style={styles.link}>
          ❤️ ({wishlist.length})
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <span style={styles.user}>Hi, {user?.firstName}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#2c3e50', color: 'white', alignItems: 'center' },
  logoText: { fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' },
  links: { display: 'flex', gap: '15px', alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none' },
  user: { fontStyle: 'italic', color: '#ecf0f1', marginLeft: '10px' },
  logoutBtn: { background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' },
  loginBtn: { background: '#27ae60', color: 'white', padding: '5px 15px', borderRadius: '4px', textDecoration: 'none' }
};

export default Navbar;
const Footer = () => (
  <footer style={styles.footer}>
    <p>&copy; {new Date().getFullYear()} E-Shop Simulation Project. All rights reserved.</p>
    <p>Built with React + DummyJSON API</p>
  </footer>
);

const styles = {
  footer: { textAlign: 'center', padding: '2rem', background: '#ecf0f1', marginTop: 'auto', borderTop: '1px solid #bdc3c7' }
};

export default Footer;
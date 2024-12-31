import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../teacher/assets/images/logo.png';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.navbarLogo}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
          Language Tutors
        </Link>
        <ul className={styles.navbarMenu}>
          <li className={styles.navbarItem}><Link to="/" className={styles.navbarLink}>Home</Link></li>
          <li className={styles.navbarItem}><Link to="/courses" className={styles.navbarLink}>Courses</Link></li>
          <li className={styles.navbarItem}><Link to="/about" className={styles.navbarLink}>About</Link></li>
          <li className={styles.navbarItem}><Link to="/contact" className={styles.navbarLink}>Contact</Link></li>
          <li className={styles.navbarItem}><Link to="/login" className={styles.navbarLink}>Login</Link></li>
          <li className={styles.navbarItem}><Link to="/signup" className={styles.navbarLink}>Sign Up</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import styles from './Contact.module.css'; // Import the CSS module

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to send the form data to your backend or email service
    // For now, we'll just display a success message
    setSuccessMessage('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
  };

  return (
    <>
      <Navbar />
      <div className={styles.contactContainer}>
        <header className={styles.headerImage}>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Reach out to us with any questions or feedback.</p>
        </header>
        <section className={styles.contactSection}>
          <h2>Get in Touch</h2>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter the subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>Send Message</button>
          </form>
        </section>
        <footer className={styles.footerSection}>
          <div className={styles.footerGrid}>
            <div className={styles.footerColumn}>
              <h3>About Us</h3>
              <ul>
                <li><a href="/how-it-works">How it Works</a></li>
                <li><a href="/affiliate-program">Affiliate Program</a></li>
                <li><a href="/education-partners">Education Partners</a></li>
                <li><a href="/careers">We are Hiring!</a></li>
                <li><a href="/become-a-teacher">Become a Teacher</a></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h3>Teachers</h3>
              <ul>
                <li><a href="/teachers/english">English Teachers</a></li>
                <li><a href="/teachers/chinese">Chinese Teachers</a></li>
                <li><a href="/teachers/french">French Teachers</a></li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h3>Support</h3>
              <p>Contact us at: <a href="mailto:support@elearningplus.com">support@elearningplus.com</a></p>
            </div>
            <div className={styles.footerColumn}>
              <h3>Follow Us</h3>
              <div className={styles.socialIcons}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://weibo.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-weibo"></i></a>
              </div>
            </div>
            <div className={styles.footerColumn}>
              <h3>Contact</h3>
              <p>Phone: +1 234 567 890</p>
              <p>Address: 1234 Learning St, Education City, ED 56789</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Contact;
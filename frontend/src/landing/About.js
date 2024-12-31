import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import styles from './About.module.css';
import storyImage from '../assets/images/about2.jpg';

function About() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/courses');
  };

  return (
    <>
      <Navbar />
      <div className={styles.aboutContainer}>
        <header className={styles.headerImage}>
          <h1>Welcome to eLearning Plus</h1>
          <p>Your one-stop solution for finding the best language tutors around the world.</p>
        </header>
        <section className={styles.missionSection}>
          <h2>Our Mission</h2>
          <p>Our mission is to connect learners with experienced tutors, enabling them to achieve their educational goals through personalized and flexible online learning.</p>
        </section>
        <section className={styles.storySection}>
          <h2>Our Story</h2>
          <p>eLearning Plus was founded with the vision to make education accessible to everyone. Our journey began in 2018, and since then, we have grown to connect thousands of learners with top-notch tutors worldwide.</p>
          <img src={storyImage} alt="Our Story" />
          <div className={styles.storyOverlay}>
            <h2>Our Journey</h2>
            <p>From humble beginnings to a global platform.</p>
          </div>
        </section>
        <section className={styles.teamSection}>
          <h2>Meet the Team</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <img src="https://via.placeholder.com/150" alt="Team Member" />
              <h3>John Doe</h3>
              <p>CEO & Founder</p>
            </div>
            <div className={styles.teamMember}>
              <img src="https://via.placeholder.com/150" alt="Team Member" />
              <h3>Jane Smith</h3>
              <p>Chief Technology Officer</p>
            </div>
            <div className={styles.teamMember}>
              <img src="https://via.placeholder.com/150" alt="Team Member" />
              <h3>Mike Johnson</h3>
              <p>Head of Marketing</p>
            </div>
          </div>
        </section>
        <section className={styles.valuesSection}>
          <h2>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <i className="fas fa-handshake"></i>
              <h3>Integrity</h3>
              <p>We uphold the highest standards of integrity in all our actions.</p>
            </div>
            <div className={styles.valueItem}>
              <i className="fas fa-star"></i>
              <h3>Excellence</h3>
              <p>We strive for excellence in everything we do.</p>
            </div>
            <div className={styles.valueItem}>
              <i className="fas fa-lightbulb"></i>
              <h3>Innovation</h3>
              <p>We embrace innovation to provide the best learning experience.</p>
            </div>
            <div className={styles.valueItem}>
              <i className="fas fa-users"></i>
              <h3>Community</h3>
              <p>We foster a supportive and inclusive community.</p>
            </div>
          </div>
        </section>
        <section className={styles.testimonialsSection}>
          <h2>What Our Students Say</h2>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonial}>
              <p>"eLearning Plus has transformed my career. The courses are top-notch and the instructors are incredibly knowledgeable."</p>
              <h3>- Sarah Williams</h3>
            </div>
            <div className={styles.testimonial}>
              <p>"I love the flexibility and the quality of the content. I've learned so much and feel more confident in my skills."</p>
              <h3>- David Brown</h3>
            </div>
            <div className={styles.testimonial}>
              <p>"The community support is amazing. I've connected with so many like-minded individuals and made lifelong friends."</p>
              <h3>- Emily Clark</h3>
            </div>
          </div>
        </section>
        <section className={styles.ctaSection}>
          <h2>Join Us Today</h2>
          <p>Become a part of our growing community and start your learning journey with eLearning Plus.</p>
          <button className={styles.ctaButton} onClick={handleGetStartedClick}>Get Started</button>
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

export default About;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/dashboard/sidebar.css';
import '../../styles/common/icons.css';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/teacher/dashboard', 
      icon: 'fas fa-home', 
      label: 'Dashboard',
      className: 'dashboard'
    },
    { 
      path: '/teacher/my-courses', 
      icon: 'fas fa-book', 
      label: 'My Courses',
      className: 'courses'
    },
    { 
      path: '/teacher/students', 
      icon: 'fas fa-users', 
      label: 'Students',
      className: 'students'
    },
    { 
      path: '/teacher/add-course', 
      icon: 'fas fa-plus', 
      label: 'Create Course',
      className: 'add'
    }
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <div className={`icon-wrapper ${item.className}`}>
            <i className={item.icon}></i>
          </div>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

export default Sidebar; 
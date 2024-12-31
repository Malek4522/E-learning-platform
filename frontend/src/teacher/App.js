import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from './components/common/Layout';
import InstructorDashboard from './components/dashboard/InstructorDashboard';
import Dashboard from './components/dashboard/Dashboard';
import Students from './components/dashboard/Students';
import CourseDetails from './components/dashboard/CourseDetails';
import AddCourse from './components/dashboard/AddCourse';
import CourseManagement from './components/course/CourseManagement';
import InstructorProfile from './components/instructor/InstructorProfile';

import './styles/common.css';
import './styles/dashboard/instructorDashboard.css';
import './styles/dashboard/sidebar.css';
import './styles/common/navbar.css';

function TeacherApp() {
  return (
    <div className="App">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="/dashboard" element={<InstructorDashboard />} />
          <Route path="/my-courses" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/course-management" element={<CourseManagement />} />
          <Route path="/profile" element={<InstructorProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default TeacherApp;

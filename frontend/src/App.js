import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import AdminApp from "./admin/AdminApp";
import TeacherApp from "./teacher/App";
import StudentApp from "./student/App";
import LandingPage from "./landing/LandingPage";
import Contact from "./landing/Contact";
import CourseCatalog from "./landing/CourseCatalog";
import CourseDetail from "./landing/CourseDetail";
import About from "./landing/About";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";

import "./app.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Role-Based Routes */}
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/teacher/*" element={<TeacherApp />} />
        <Route path="/student/*" element={<StudentApp />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

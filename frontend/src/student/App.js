import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Grades from "./pages/Grades";
import Profile from "./pages/Profile";
import Studentcourses from "./pages/student_courses";
import CourseDetails from "./pages/CourseDetails";

function StudentApp() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="grades" element={<Grades />} />
        <Route path="profile" element={<Profile />} />
        <Route path="courses" element={<Studentcourses />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
      </Route>
    </Routes>
  );
}

export default StudentApp;

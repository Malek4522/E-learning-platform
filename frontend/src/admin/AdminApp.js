import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";

function AdminApp() {
  return (
    <div className="admin-app">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </div>
  );
}

export default AdminApp;
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminProfile from "./pages/AdminProfile";
// import AdminSettings from "./pages/AdminSettings";

// function AdminApp() {
//   return (
//     <div className="admin-app">
//       <Routes>
//         {/* Default admin route */}
//         <Route path="/" element={<AdminDashboard />} />
        
//         {/* Other admin routes */}
//         <Route path="/profile" element={<AdminProfile />} />
//         <Route path="/settings" element={<AdminSettings />} />
        
//         {/* Catch any unknown admin routes */}
//         <Route path="*" element={<Navigate to="." replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default AdminApp;
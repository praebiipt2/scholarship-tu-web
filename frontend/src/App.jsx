// frontend/src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";
import Scholarships from "./pages/Scholarships";

import NotFound from "./pages/notFound";

import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import NotiStudent from "./pages/NotiStudent";
import NotiAdmin from "./pages/NotiAdmin";

import NewsManagement from "./pages/NewsManagement";
import ScholarshipsManagement from "./pages/ScholarshipsManagement";
import StudentManagement from "./pages/StudentManagement";
import DashboardAdmin from "./pages/DashboardAdmin";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  const location = useLocation();

  // ให้ Sidebar โผล่เฉพาะหน้า /admin* ยกเว้น /admin/noti
  const showSidebar =
    location.pathname.startsWith("/admin") &&
    location.pathname !== "/admin/noti";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* เนื้อหาหลัก */}
      <div className="flex pt-24 flex-1">
        {showSidebar && <Sidebar />}

        {/* ถ้ามี Sidebar ให้ขยับ content ไปทางขวา 16rem (ml-64) */}
        <div className={`w-full ${showSidebar ? "ml-64" : ""}`}>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/news" element={<News />} />
            <Route path="/scholarships" element={<Scholarships />} />

            {/* route ของ student */}
            <Route element={<ProtectedRoute roleRequired="student" />}>
              <Route path="/user/noti" element={<NotiStudent />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/bookmarks" element={<Bookmarks />} />
            </Route>

            {/* route ของ admin */}
            <Route element={<ProtectedRoute roleRequired="admin" />}>
              {/* หน้าแจ้งเตือนของเจ้าหน้าที่ */}
              <Route path="/admin/noti" element={<NotiAdmin />} />

              {/* หน้าจัดการต่าง ๆ */}
              <Route path="/admin/news" element={<NewsManagement />} />
              <Route
                path="/admin/scholarship"
                element={<ScholarshipsManagement />}
              />
              <Route path="/admin/student" element={<StudentManagement />} />
              <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;

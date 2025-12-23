import React, { useEffect, useContext } from "react";
import { Link, useNavigate ,useLocation} from "react-router-dom";
import { UserContext } from "../UserContext";
import axiosInstance from "../axiosInstance";

import { VscDashboard } from "react-icons/vsc";
import { IoNewspaperOutline, IoSchoolSharp } from "react-icons/io5";
import { PiStudentFill } from "react-icons/pi";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-orange-400 text-white font-medium"
      : "text-purple-900";

  const baseClass =
    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-400 transition";
  return (
    <aside className="fixed top-20 left-0 z-20 w-64 h-full bg-orange-300 shadow-lg">
      <div className="h-full px-4 py-12 overflow-y-auto space-y-2">

        {/* Dashboard */}
        <Link
          to="/admin/dashboard"
          className={`${baseClass} ${isActive("/admin/dashboard")}`}
        >
          <VscDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        {/* Student Management */}
        <Link
          to="/admin/student"
          className={`${baseClass} ${isActive("/admin/student")}`}
        >
          <PiStudentFill size={20} />
          <span>จัดการนักศึกษา</span>
        </Link>

        {/* News Management */}
        <Link
          to="/admin/news"
          className={`${baseClass} ${isActive("/admin/news")}`}
        >
          <IoNewspaperOutline size={20} />
          <span>จัดการข่าวประชาสัมพันธ์</span>
        </Link>

        {/* Scholarship Management */}
        <Link
          to="/admin/scholarship"
          className={`${baseClass} ${isActive("/admin/scholarship")}`}
        >
          <IoSchoolSharp size={20} />
          <span>จัดการทุนการศึกษา</span>
        </Link>

      </div>
    </aside>
    
    
  );
}

export default Sidebar;

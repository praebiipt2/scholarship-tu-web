import React, { createContext, useState, useEffect } from "react";

import axiosInstance from "./axiosInstance";

export const UserContext = createContext(); //createContext = ที่เก็บข้อมูลกลางจะได้ไม่ต้องเขียนหลาย jsx

function UserProvider({ children }) {
  const [user, setUser] = useState(null); //เก็บข้อมูล user
  const [token, setToken] = useState(null); //เก็บ token
  const [role, setRole] = useState(null);// เก็บ role
  const [loading, setLoading] = useState(true);// ไว้ verify Token ก่อน 
  

  /* ตรวจสอบ token ของจริงไหม/หมดอายุ/ถูกแก้ไขไหม */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setToken(token);
      setRole(role);
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

   /* ตรวจ token จาก server  */
  const verifyToken = async (jwtToken) => {
    try {
       /* ใช้ axiosInstance แทน axios */
      const res = await axiosInstance.get("/navbar", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      // สมมติ backend ส่ง user object กลับมา
      setUser(res.data.user);
    } catch (err) {
      console.error("Authorization Error");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      setToken(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  //set token ให้เป็น null เมื่อ log out
  const logout = async () => {
    try {
      const res = await axiosInstance.get("/logout");
      console.log(res.data)
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
      setToken(null);
      setRole(null);
    }
  };


  return <div>
    <UserContext.Provider
      value={{ user, token, role, loading, setUser, setToken, setRole, logout }} // value = component ที่เข้าถึงอะไรได้บ้าง
    >
      {children}
    </UserContext.Provider>
  </div>;
}

export default UserProvider;

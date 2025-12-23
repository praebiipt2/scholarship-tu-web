import React, { useEffect, useState, useContext } from "react";

import axiosInstance from "../axiosInstance";
import ScholarshipCard from "../components/Scholarship/ScholarshipCard";
import { UserContext } from "../UserContext";

const Bookmarks = () => {
  const [cards, setCards] = useState([]);
  const { token } = useContext(UserContext);

   const reload = async () => {
    try {
      const res = await axiosInstance.get("/api/bookmarks");
      setCards(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (token) reload();
  }, [token]);


  return (
    <div className="p-4 bg-gray-50">
      <h2 className="text-lg font-semibold text-center px-8 text-gray-900 p-8">
        บุ๊กมาร์ก
      </h2>
      
      <div className="flex flex-row flex-wrap gap-12 justify-center pb-8">
         {/* ถ้ายังไม่มีทุนที่ bookmark */}
        {cards.length === 0 ? (
          <p>ยังไม่มีทุนที่ bookmark ไว้</p>
        ) : (
          /* ถ้ามีทุนที่ bookmark cards.map สร้าง card ตามจำนวนทุน*/
          cards.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.scholarship_id} /* ให้มี key เพื่อไม่ให้เกิด err */
              scholarship={scholarship}
              bookmarked={true}
              /* bookmarked={cards.some(c => c.scholarship_id === scholarship.scholarship_id)} //ให่แสดงทุนที่ bookmark ไว้ */
              onBookmark={reload} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmarks;

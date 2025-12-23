import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";

import axiosInstance from "../axiosInstance";

import ScholarshipCard from "../components/Scholarship/ScholarshipCard";

const Scholarships = () => {
  const API_URL = "/api/scholarships";

  const [card, setCards] = useState([]);

  const [bookmarks, setBookmarks] = useState([]);

  /* get ข้อมูลทุน */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCards = await axiosInstance.get(API_URL); //เก็บข้อมูลทุน
        setCards(resCards.data);

        const resBookmarks = await axiosInstance.get("/api/bookmarks");
        setBookmarks(resBookmarks.data.map((b) => b.scho_id)); //เก็บทุนที่มีการ bookmark ไว้ ลง setBookmarks
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  /* กด bookmark */
  const handleBookmark = async (id) => {
    try {
      /* update bookmark */
      const res = await axiosInstance.get("/api/bookmarks");
      setBookmarks(res.data.map((b) => b.scho_id));

      const cardsRes = await axiosInstance.get(API_URL);
      setCards(cardsRes.data);

      console.log("bookmark sucecss", id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnroll = (id) => {
    console.log("Enroll success:", id);
  };

  
  const [search, setSearch] = useState(""); //ค้นหา
  const [filterType, setFilterType] = useState(""); //ประเภททุน
  const [filterSource, setFilterSource] = useState(""); //แหล่งที่มา

  const filteredCards = card.filter((s) => {
    const matchSearch = s.scho_name
      .toLowerCase()
      .includes(search.toLowerCase());

    return (
      matchSearch &&
      (filterType === "" || s.scho_type === filterType) &&
      (filterSource === "" || s.scho_source === filterSource)
    );
  });

  return (
    <div className="bg-gray-50">
      <h2 className="text-lg font-semibold text-center px-8 text-gray-900 p-8">
        ทุนการศึกษา
      </h2>
      {/* ค้นหา */}
      <div className="relative w-full max-w-[75%] mx-auto mt-4 pb-2">
        <input
        type="text"
        placeholder="ค้นหาชื่อทุน..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full h-12 pl-6 pr-12 rounded-full shadow border border-gray-200
               focus:outline-none focus:ring-2 focus:ring-purple-700
               text-gray-700"
        />
        <button className="absolute right-6 top-6">
          <IoIosSearch className="text-purple-700 h-5 w-5 absolute top-1/2 -translate-y-1/2 right-6 fill-current"/>
        </button>

      </div>

      <div className="w-full max-w-[94%] mx-auto flex gap-4 py-4 justify-end ">
        {/* ฟิลเตอร์ type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-40 shadow border border-gray-200
               focus:outline-none focus:ring-2 focus:ring-purple-700
               text-gray-700 rounded-lg "
        >
          <option value="" className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden">ประเภททุน</option>
          <option value="ทุนเหมาจ่าย" className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden">ทุนเหมาจ่าย</option>
          <option value="ทุนระยะยาว" className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden">ทุนระยะยาว</option>
        </select>
        {/* ฟิลเตอร์ source */}
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="w-40 shadow border border-gray-200
               focus:outline-none focus:ring-2 focus:ring-purple-700
               text-gray-700 rounded-lg "
        >
          <option value="" className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden">แหล่งที่มา</option>
          <option value="ทุนภายใน" className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden" >ทุนภายใน</option>
          <option value="ทุนภายนอก" className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden">ทุนภายนอก</option>
        </select>
      </div>
      <span className="flex flex-row flex-wrap gap-12 justify-center pb-8">
        {filteredCards.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.scholarship_id}
            scholarship={scholarship}
            bookmarked={bookmarks.includes(scholarship.scholarship_id)}
            onBookmark={handleBookmark}
            onEnroll={handleEnroll}
          />
        ))}
      </span>
    </div>
  );
};

export default Scholarships;

import React, { useState, useEffect } from "react";

import axiosInstance from "../axiosInstance";
import Modal from "./Modal";

function NewsCard() {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fatchNews = async () => {
      try {
        const res = await axiosInstance.get("/api/news");
        setNews(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fatchNews();
  }, []);

  const openModal = (content) => {
    setSelectedNews(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNews(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-3">
      {/* แถบ */}
      {news.map((content) => (
        <div
          key={content.news_id}
          onClick={() => openModal(content)}
          className="w-full cursor-pointer flex flex-col mt-2 mb-6 bg-white shadow-sm border border-slate-200 rounded-lg p-4"
        >
          {/* หัวข้อข่าว */}
          <h2 className="font-semibold text-gray-800 text-base">
            {content.news_title}
          </h2>

          {/* วันที่ประกาศ - แสดงใต้หัวข้อ */}
          <p className="text-xs text-gray-500 mt-1">
            วันที่ประกาศ:{" "}
            {new Date(content.created_at).toLocaleDateString("th-TH")}
          </p>
        </div>
      ))}

      {/* Modal แสดงเนื้อหาข่าว */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedNews && (
          <div>
            <h2 className="mb-2 text-slate-800 text-xl font-semibold">
              {selectedNews.news_title}
            </h2>

            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {selectedNews.news_content}
            </p>

            {/* ปุ่มโหลด PDF */}
            {selectedNews.news_file && (
              <a
                href={`http://localhost:5100/uploads/news/${selectedNews.news_file}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full mt-4 px-4 py-2 rounded-lg bg-[#219B9D] text-white text-center hover:bg-[#08595b]"
              >
                ดาวน์โหลดเอกสาร
              </a>
            )}

            <p className="mt-4 text-xs text-gray-400">
              วันที่ประกาศ:{" "}
              {new Date(selectedNews.created_at).toLocaleString("th-TH")}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default NewsCard;

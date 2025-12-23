import React, { useState, useEffect } from "react";

import axiosInstance from "../axiosInstance";

import ActionButton from "../components/button/ActionButton";
import SocialButton from "../components/button/SocialButton";
import NewsTable from "../components/NewsManagement/NewsTable";
import NewsForm from "../components/NewsManagement/NewsForm";
import Modal from "../components/Modal";

const NewsManagement = () => {
  const [news, setNews] = useState([]);

  /* pop up สำหรับแก้และเพิ่ม */
  const [isModalOpen, setIsModalOpen] = useState(false);
  /* pop up ลบ */
  const [deleteModel, setDeleteModel] = useState(false);

  const [updateNews, setUpdateNews] = useState(null);

  const [selectedId, setSelectedId] = useState([]);

  const API_URL = "/admin/news";
  const handleCloseModal = () => setIsModalOpen(false);

  const handleStatus = (id, newStatus) => {
    setNews((currentState) =>
      currentState.map((n) =>
        n.news_id === id ? { ...n, is_active: newStatus } : n
      )
    );
  };

  /* get ข่าว */
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      setNews(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* เพิ่ม */
  const handleAddClick = () => setIsModalOpen(true);
  const handleAdd = async (formData) => {
    try {
      console.log(formData);
      await axiosInstance.post(API_URL, formData);

      /* โหลดใหม่ให้แสดงผล */
      fetchNews();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* แก้ไข */
  const handleUpdateClick = (news) => {
    setUpdateNews(news);
    setIsModalOpen(true);
  };

  const handleUpdate = async (formData) => {
    const id = updateNews?.news_id;
    if (!id) return;

    const form = new FormData();
    form.append("news_title", formData.get("news_title"));
    form.append("news_content", formData.get("news_content"));
    form.append("is_active", updateNews.is_active);

    /* ถ้ามีไฟล์ใหม่ให้ append */
    if (formData.get("news_file")) {
      form.append("news_file", formData.get("news_file"));
    }

    try {
      /* Content-Type เป็น JSON เพื่อให้ backend อ่าน req.body  */
      await axiosInstance.patch(`${API_URL}/${id}`, form);

      fetchNews(); //โหลดตารางใหม่
      setIsModalOpen(false); //ปิด popup
      setUpdateNews(null); //reset form
    } catch (err) {
      console.log(err);
    }
  };

  /* ลบ */
  const handleDelete = async () => {
    try {
      console.log("Deleting IDs:", selectedId);
      await axiosInstance.delete(`${API_URL}`, { data: { ids: selectedId } }); //ส่งเป็น object แทน id เพราะมีหลายตัว
      setDeleteModel(false);
      setSelectedId([]);
      fetchNews();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <h2 className="text-lg font-semibold text-center px-8 text-gray-900 p-8">
        จัดการข่าวประชาสัมพันธ์
      </h2>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NewsForm
          onSubmit={(data) => {
            if (updateNews) {
              handleUpdate(data);
            } else {
              handleAdd(data);
            }
          }}
          onCancel={handleCloseModal}
          data={updateNews}
        />
      </Modal>

      <div className="flex justify-center w-full max-w-full h-auto">
        <div className="w-[80%] mx-auto">
          {/* ปุ่ม */}
          <div className="justify-end flex gap-2 mb-1 items-center">
            <ActionButton
              action="delete"
              onClick={() => {
                if (selectedId.length === 0) {
                  //ไว้เลือกทุนที่จะลบ
                  alert("กรุณาเลือกข่าวที่ต้องการลบ");
                  return;
                }
                setDeleteModel(true);
              }}
            >
              ลบ
            </ActionButton>
            <ActionButton action="add" onClick={handleAddClick}>
              เพิ่ม
            </ActionButton>
          </div>
          <NewsTable
            news={news}
            onEditClick={handleUpdateClick}
            onStatusChange={handleStatus}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>

      {/* ยืนยันก่อนลบ */}
      <Modal isOpen={deleteModel} onClose={() => setDeleteModel(false)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ยืนยันการลบข้อมูล
        </h3>
        <p className="text-gray-600 mb-6">
          คุณต้องการลบ {selectedId.length} ข่าวหรือไม่?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteModel(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ลบ
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NewsManagement;

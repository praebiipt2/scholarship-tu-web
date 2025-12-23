import React, { useState, useEffect } from "react";

import Input from "../input/InputBox";
import About from "../input/About";

function NewsForm({ onSubmit, onCancel, data = {} }) {
  const [formData, setFormData] = useState(
    data || {
      news_id: data?.id || "",
      news_title: "",
      news_content: "",
      news_file: null,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("news_title", formData.news_title);
    form.append("news_content", formData.news_content);
    form.append("is_active", data?.is_active ?? 1);
    if (formData.news_file) {
      form.append("news_file", formData.news_file);
    }

    onSubmit(form);
  };

  useEffect(() => {
    if (data) {
      setFormData({
        news_id: data?.id || "",
        news_title: data.news_title || "", // ไม่มี data. จะ set ค่าว่างทุกครั้งที่ต้องการแก้ไข
        news_content: data.news_content || "",
        news_file: null,
        is_active: data.is_active,
      });
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <Input
        id="ข่าว"
        label="ชื่อข่าวประชาสัมพันธ์"
        type="text"
        name="news_title"
        placeholder=""
        required
        value={formData.news_title}
        onChange={handleChange}
      />
      <About
        id="คำอธิบาย"
        label="คำอธิบาย"
        name="news_content"
        value={formData.news_content}
        onChange={handleChange}
      />

      <div className="mt-4">
        <label className="block text-gray-700">ไฟล์ประกาศ (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              news_file: e.target.files[0],
            }))
          }
          className="mt-2"
        />
      </div>

      <div className="md:col-span-2 grid grid-cols-2 gap-2 mt-4 w-xl">
        <button
          type="submit"
          className="bg-purple-800 hover:bg-purple-900 w-full text-white px-8 py-2 rounded-lg font-medium shadow"
        >
          บันทึกข้อมูล
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-200 hover:bg-gray-300 px-8 py-2 rounded-lg font-medium"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}

export default NewsForm;

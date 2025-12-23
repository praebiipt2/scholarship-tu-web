import React, { useState, useEffect } from "react";

import Input from "../input/InputBox";
import Datepicker from "../input/DateSelect";
import About from "../input/About";

function ScholarshipForm({ onSubmit, onCancel, data = {} }) {
  const [formData, setFormData] = useState(
    data || {
      id: data?.id || "", //ถ้ามี id จะใช้งาน update แต่ถ้าไม่มีจะเป็นการ add
      schoName: "",
      schoYear: "",
      type: "",
      source: "",
      std_year: "",
      std_gpa: "",
      std_income: "",
      endDate: "",
      desp: "",
      is_active: "1",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const form = new FormData();

  const handleSubmit = (e) => {
    e.preventDefault();
    /* onSubmit(formData); */

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (!(value instanceof File)) {
        formDataToSend.append(key, value);
      }
    });

    if (formData.file instanceof File) {
      formDataToSend.append("file", formData.file);
    }
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    onSubmit(formDataToSend);
  };

  useEffect(() => {
    if (data) {
      setFormData({
        id: data?.id || "",
        schoName: data.scho_name || "",
        schoYear: data.scho_year || "",
        type: data.scho_type || "",
        source: data.scho_source || "",
        std_year: data.std_year ?? "",
        std_gpa: data.std_gpa ?? "",
        std_income: data.std_income ?? "",
        startDate: data.start_date || "",
        endDate: data.end_date || "",
        desp: data.scho_desp || "",
        file: data?.scho_file || null,
        image: data?.image_file || null,
        is_active: data.is_active?.toString() || "1",
      });
    }
  }, [data]);

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4 w-3xl"
    >
      <div className="md:col-span-2">
        <Input
          id="ทุน"
          label="ชื่อทุนการศึกษา"
          type="text"
          name="schoName"
          placeholder=""
          required
          pattern="text"
          value={formData.schoName}
          onChange={handleChange}
        />
      </div>

      <Input
        id="ปี"
        label="ปีการศึกษา"
        type="number"
        name="schoYear"
        placeholder=""
        required
        pattern="number"
        value={formData.schoYear}
        onChange={handleChange}
        options={[
          { label: "2568", value: 2568 },
          { label: "2569", value: 2569 },
          { label: "2570", value: 2570 },
          { label: "2571", value: 2571 },
          { label: "2572", value: 2572 },
          { label: "2573", value: 2573 },
          { label: "2574", value: 2574 },
          { label: "2575", value: 2575 },
          { label: "2576", value: 2576 },
          { label: "2577", value: 2577 },
          { label: "2578", value: 2578 },
        ]}
      />

      <Input
        id="ประเภททุน"
        label="ประเภททุน"
        type="text"
        name="type"
        placeholder=""
        required
        options={["ทุนเหมาจ่าย", "ทุนระยะยาว"]}
        value={formData.type}
        onChange={handleChange}
      />

      <Input
        id="แหล่งทุน"
        label="แหล่งทุน"
        type="text"
        name="source"
        placeholder=""
        required
        options={["ทุนภายใน", "ทุนภายนอก"]}
        value={formData.source}
        onChange={handleChange}
      />

      <Input
        id="รับนักศึกษาปีที่"
        label="รับนักศึกษาปีที่"
        type="text"
        name="std_year"
        placeholder=""
        value={formData.std_year}
        onChange={handleChange}
        options={[
          { label: "ไม่มีกำหนดชั้นปี", value: 0 },
          { label: "ปี 1 ขึ้นไป", value: 1 },
          { label: "ปี 2 ขี้นไป", value: 2 },
          { label: "ปี 3 ขึ้นไป", value: 3 },
          { label: "รับเฉพาะปีที่ 1", value: -1 },
          { label: "รับเฉพาะปีที่ 2", value: -2 },
          { label: "รับเฉพาะปีที่ 3", value: -3 },
          { label: "รับเฉพาะปีที่ 4", value: -4 },
        ]}
      />

      <Input
        id="เกรดเฉลี่ยขั้นต่ำ"
        label="เกรดเฉลี่ยขั้นต่ำ"
        type="number"
        name="std_gpa"
        placeholder=""
        pattern="decimal"
        value={formData.std_gpa || data?.std_gpa}
        onChange={handleChange}
      />

      <Input
        id="รายได้ขั้นต่ำ"
        label="รายได้ขั้นต่ำ"
        type="number"
        name="std_income"
        placeholder="150000"
        value={formData.std_income}
        onChange={handleChange}
      />

      <Datepicker
        id="เริ่มต้นโครงการ"
        label="เริ่มต้นโครงการ"
        name="start_date"
        value={formData.startDate}
        onChange={(dateString) =>
          setFormData({ ...formData, startDate: dateString })
        }
      />

      <Datepicker
        id="สิ้นสุดโครงการ"
        label="สิ้นสุดโครงการ"
        name="endDate"
        value={formData.endDate}
        onChange={(dateString) =>
          setFormData({ ...formData, endDate: dateString })
        }
      />

      <div className="md:col-span-2">
        <About
          id="คำอธิบาย"
          label="คำอธิบาย"
          name="desp"
          value={formData.desp}
          onChange={handleChange}
        />
      </div>

      <span className="md:col-span-2">
        <p className="pb-1 text-gray-800">อัปโหลดภาพ</p>

        {/* แสดงไฟล์เก่า */}
        {formData.image && typeof formData.image === "string" && (
          <div className="mb-2">
            <img
              src={`/uploads/${formData.image}`} // path ไฟล์เก่า
              alt="Uploaded"
              className="w-20 h-20 object-cover mb-1"
            />
            <p>Current file: {formData.image}</p>
          </div>
        )}

        {/* input สำหรับไฟล์ใหม่ */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />
      </span>

      <span className="md:col-span-2">
        <p className="pb-1 text-gray-800">อัปโหลด PDF</p>

        {formData.file && typeof formData.file === "string" && (
          <div className="mb-2">
            <p>Current file: {formData.file}</p>
            <a
              href={`/uploads/${formData.file}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              ดูไฟล์
            </a>
          </div>
        )}

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFormData({ ...formData, file: e.target.files[0] })
          }
        />
      </span>

      <div className="md:col-span-2 grid grid-cols-2 gap-2 mt-4">
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

export default ScholarshipForm;

import React from "react";

import InputBox from "../input/InputBox";

function StudentForm({ student, setStudent, onSave }) {
  /* รับ input */
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4 pb-4 pl-4">
      <InputBox
        id="ชื่อ"
        label="ชื่อ"
        type="text"
        name="std_name"
        placeholder="ชื่อ"
        pattern="text"
        value={student.std_name || ""} //แสดงค่าเดิมของข้อมูล
        onChange={handleChange}
      />

      <InputBox
        id="นามสกุล"
        label="นามสกุล"
        type="text"
        name="std_lastname"
        placeholder="นามสกุล"
        pattern="text"
        value={student.std_lastname || ""}
        onChange={handleChange}
      />

      <InputBox
        id="นักศึกษาปีที่"
        label="นักศึกษาปีที่"
        type="text"
        name="std_year"
        placeholder=""
        value={student.std_year || ""}
        onChange={handleChange}
        options={[
          { label: "ปี 1", value: 1 },
          { label: "ปี 2", value: 2 },
          { label: "ปี 3", value: 3 },
          { label: "ปี 4", value: 4 },
        ]}
      />

      <InputBox
        id="อีเมล"
        label="อีเมล"
        type="email"
        name="email"
        placeholder="example@gmail.com"
        value={student.email || ""}
        onChange={handleChange}
      />

      <InputBox
        id="เบอร์โทร"
        label="เบอร์โทร"
        type="text"
        name="phone"
        placeholder="08xxxxxxxx"
        pattern="number"
        value={student.phone || ""}
        onChange={handleChange}
      />

      <InputBox
        id="เกรดเฉลี่ย"
        label="เกรดเฉลี่ย"
        type="number"
        name="std_gpa"
        placeholder=""
        required
        pattern="decimal"
        value={student.std_gpa || ""}
        onChange={handleChange}
      />
      <div className="md:col-span-2">
        <InputBox
          id="รายได้ต่อปี"
          label="รายได้ต่อปี"
          type="number"
          name="std_income"
          placeholder=""
          pattern="number"
          value={student.std_income || ""}
          onChange={handleChange}
        />
      </div>

      <div className="lg:col-span-2 flex justify-center pt-1">
        <button
          onClick={onSave}
          className="bg-purple-700 hover:bg-purple-800 w-full text-white px-8 py-2 rounded-lg font-medium shadow"
        >
          บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
}

export default StudentForm;

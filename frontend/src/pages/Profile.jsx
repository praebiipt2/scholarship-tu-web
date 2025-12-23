import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";

import axiosInstance from "../axiosInstance";
import StudentForm from "../components/StudentProfile/StudentForm";
import EnrollList from "../components/StudentProfile/EnrollList";
import Modal from "../components/Modal";
import Avatar from "../components/Avatar";
import StudentDashboard from "../components/StudentProfile/StudentDashboard";

const Profile = () => {
  const { token } = useContext(UserContext);
  const [student, setStudent] = useState({});
  const [enrolled, setEnrolled] = useState([]);
  const [dashboard, setDashboard] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  /* ไว้ reload หน้าทันที เพราะ get หลายตารางเลยใช้ load */
  const load = async () => {
    const res = await axiosInstance.get("/user/profile");
    setStudent(res.data.student);
    setEnrolled(res.data.enrolled);
    setDashboard((prev) => prev + 1); //ไม่ใช่กำหนดค่าเหมือนสองตัวบน แต่เป็น update ค่า
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const updateStudent = async () => {
    await axiosInstance.put("/user/profile", student);
    setOpenModal(false); // ปิด modal
    load();
  };

  const toggleStatus = async (id) => {
    await axiosInstance.put(`/user/enroll/toggle/${id}`);
    load();
  };

  return (
    <div className="shadow-md rounded-lg p-8 pb-12 border border-gray-100 bg-gray-50 ">
      <h2 className="text-lg font-semibold text-center px-8 text-gray-900 p-8">
        โปรไฟล์
      </h2>

      {/* แสดงข้อมูล */}
      <div className="bg-white shadow-md rounded-xl p-10 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ภาพ avatar */}
          <div className="flex items-center justify-center">
            <Avatar
              name={`${student.std_name ?? ""} ${student.std_lastname ?? ""}`}
              size={250}
            />
          </div>

          {/* form */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-1">
                ชื่อ - นามสกุล :
              </label>
              <div className="bg-gray-50 border border-gray-100 p-2 rounded">
                {student.std_name} {student.std_lastname}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">
                รหัสประจำตัวนักศึกษา :
              </label>
              <div className="bg-gray-50 border border-gray-100 p-2 rounded">{student.std_id}</div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">ชั้นปีที่ :</label>
              <div className="bg-gray-50 border border-gray-100 p-2 rounded">{student.std_year}</div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">email :</label>
              <div className="bg-gray-50 border border-gray-100 p-2 rounded">
                {student.email ?? "—"}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">เบอร์โทร :</label>
              <div className="bg-gray-50 border border-gray-100 p-2 rounded">
                {student.phone ?? "—"}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">เกรดเฉลี่ย :</label>
              <div className="bg-gray-50 border border-gray-100 p-2 rounded">{student.std_gpa}</div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-600 mb-1">
                รายได้ครอบครัวเฉลี่ยต่อปี :
              </label>
              <div className="bg-gray-50 border border-gray-100 p-2 rounded">
                {student.std_income}
              </div>
            </div>
            {/* edit */}
            <div className="lg:col-span-2 flex justify-center pt-1">
              <button
                onClick={() => setOpenModal(true)}
                className="bg-purple-700 hover:bg-purple-800 w-full text-white px-8 py-2 rounded-lg font-medium shadow"
              >
                แก้ไขข้อมูล
              </button>
            </div>
            <p className="lg:col-span-2 flex justify-start pb-1 text-sm text-red-500 ">
              *กรุณาอัพเดทข้อมูลทุกเทอมเพื่อให้สามารถตรวจสอบคุณสมบัติทุนได้ถูกต้อง
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-lg font-semibold text-gray-800 mb-8 text-center">แก้ไขข้อมูล</h2>

        <StudentForm
          student={student}
          setStudent={setStudent}
          onSave={updateStudent}
        />
      </Modal>

      <div className="mb-8 bg-white shadow-md rounded-xl p-10 ">
        <StudentDashboard reload={dashboard} />
      </div>

      <div className="w-full  bg-white shadow-md rounded-xl  px-4 py-6">
        <EnrollList enrolls={enrolled} onToggle={toggleStatus} />
        <p className="flex justify-start pb-1 pt-6 text-sm text-red-600">
          *การอัพเดทสถานะการได้รับทุนจะเป็นส่วนช่วยการตัดสินใจดูทุนของคนอื่นได้
          ทางเราขอขอบคุณอย่างยิ่ง
        </p>
      </div>
    </div>
  );
};

export default Profile;

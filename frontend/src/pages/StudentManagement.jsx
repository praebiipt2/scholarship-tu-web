import React, { useState, useEffect } from "react";

import StudentTable from "../components/StudentManagement/StudentTable";
import SocialButton from "../components/button/SocialButton";
import Modal from "../components/Modal";

import axiosInstance from "../axiosInstance";

const StudentManagement = () => {
  const API_URL = "/admin/student";
  const [student, setStudent] = useState([]);

  /* get ทุน */
  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      setStudent(res.data.students); //students = arr
      console.log(res.data.students);
    } catch (err) {
      console.log(err);
    }
  };

  /* filter */
  const [filterInterest, setFilterInterest] = useState("");
  let display = student.slice(); //copy arr std
  if (filterInterest === "desc") {
    display.sort((a, b) => b.scholarship_interest - a.scholarship_interest);
  }
  if (filterInterest === "asc") {
    display.sort((a, b) => a.scholarship_interest - b.scholarship_interest);
  }

  const [studentInfo, setStudentInfo] = useState([]);
  const [modal, setModal] = useState(false);

  const modalIsOpen = async (std) => {
    try {
      const res = await axiosInstance.get(`/admin/student/${std.std_id}/full`);
      setStudentInfo(res.data);
      setModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <h2 className="text-lg font-semibold text-center  text-gray-900 p-8">
        จัดการนักศึกษา
      </h2>

      <div className="w-full max-w-[80%] mx-auto flex gap-4 py-4 justify-end">
        <select
          className="w-80 shadow border border-gray-200
               focus:outline-none focus:ring-2 focus:ring-purple-700
               text-gray-700 rounded-lg"
          value={filterInterest}
          onChange={(e) => setFilterInterest(e.target.value)}
        >
          <option value="">เรียงลำดับความสนใจทุน</option>
          <option value="desc">สนใจสมัครทุนมากไปน้อย</option>
          <option value="asc">สนใจสมัครทุนน้อยไปมาก</option>
        </select>
      </div>

      <div className="flex justify-center w-full max-w-full h-auto">
        <div className="w-[80%] mx-auto">
          <StudentTable
            studentData={display}
            onOpenFullModal={(std) => modalIsOpen(std)}
          />
        </div>
      </div>

      <Modal isOpen={modal} onClose={closeModal}>
        {studentInfo?.student && (
          <div className="space-y-4">
            {/* ข้อมูลนักศึกษา  */}
            <div>
              <h2 className="text-xl font-bold mb-2">ข้อมูลนักศึกษา</h2>
              <p className="text-gray-400">
                ชื่อ:{" "}
                <span className="text-black">
                  {studentInfo.student.std_name}{" "}
                  {studentInfo.student.std_lastname}
                </span>
              </p>
              <p className="text-gray-400">
                รหัสนักศึกษา:{" "}
                <span className="text-black">{studentInfo.student.std_id}</span>
              </p>
              <p className="text-gray-400">
                ชั้นปี:{" "}
                <span className="text-black">
                  {studentInfo.student.std_year}
                </span>
              </p>
              <p className="text-gray-400">
                GPA:{" "}
                <span className="text-black">
                  {studentInfo.student.std_gpa}
                </span>
              </p>
              <p className="text-gray-400">
                ระดับความสนใจสมัครทุน:{" "}
                <span className="text-black">
                  {studentInfo.student.scholarship_interest}
                </span>
              </p>
            </div>

            {/* Bookmark */}
            <div className="py-2">
              <h4 className="font-semibold">ทุนที่ Bookmarks</h4>
              {studentInfo.bookmark.length > 0 ? (
                studentInfo.bookmark.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg mb-2"
                  >
                    <p>
                      <span className="text-gray-400">ชื่อทุน:</span>{" "}
                      {s.scho_name}
                    </p>
                    <p>
                      <span className="text-gray-400">ประเภท:</span>{" "}
                      {s.scho_type}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีการ Bookmark</p>
              )}
            </div>

            {/* Enroll  */}
            <div className="py-2">
              <h4 className="font-semibold ">สถานะทุน</h4>

              {studentInfo.enroll.length > 0 ? (
                studentInfo.enroll.map((s, i) => {
                  // กำหนดสีตามสถานะ
                  let bgColor = "";
                  let statusText = "";
                  let statusColor = "";

                  if (s.enroll_status === 1) {
                    bgColor = "bg-green-100 border-green-500";
                    statusText = "สมัครสำเร็จ";
                    statusColor = "text-green-600 ";
                  } else if (s.enroll_status === 0) {
                    bgColor = "bg-gray-100 border-gray-400";
                    statusText = "รอผล";
                    statusColor = "text-gray-600";
                  }

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg mb-2 border-l-4 ${bgColor}`}
                    >
                      <p>
                        <span className="text-gray-400">ชื่อทุน:</span>{" "}
                        {s.scho_name}
                      </p>
                      <p>
                        <span className="text-gray-400">ประเภท:</span>{" "}
                        {s.scho_type}
                      </p>

                      <p className={`mt-1 ${statusColor}`}>
                        <span>สถานะ: </span>
                        {statusText}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">ยังไม่ได้สมัครทุน</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentManagement;

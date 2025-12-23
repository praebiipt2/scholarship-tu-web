// frontend/src/components/StudentManagement/StudentTable.jsx
import React, { useState } from "react";

function StudentTable({ studentData, onOpenFullModal }) {
  // state สำหรับ popup LINE
  const [selectedStudent, setSelectedStudent] = useState(null);

  // แปลง obj เป็น array + กันกรณี studentData ยังเป็น undefined/null
  const isArr = Array.isArray(studentData)
    ? studentData
    : studentData
    ? [studentData]
    : [];

  const handleOpenLineModal = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseLineModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* หัวตาราง */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <td scope="col" className="px-6 py-3">
              ชื่อ
            </td>
            <td scope="col" className="px-6 py-3">
              นามสกุล
            </td>
            <td scope="col" className="px-6 py-3">
              รหัสนักศึกษา
            </td>
            <td scope="col" className="px-6 py-3">
              ชั้นปีที่
            </td>
            <td scope="col" className="px-6 py-3">
              เกรดเฉลี่ย
            </td>
             <td scope="col" className="px-6 py-3">
              ความสนใจในการสมัครทุน
            </td>
            <td scope="col" className="px-6 py-3">
              สถานะ
            </td>
            <td scope="col" className="px-6 py-3">
              ส่งข้อความผ่าน LINE
            </td>
          </tr>
        </thead>

        {/* row */}
        <tbody>
          {isArr.map((e) => (
            <tr
              key={e.user_id}
              className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                onClick={() => onOpenFullModal(e)}
              >
                {e.std_name}
              </td>

              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                onClick={() => onOpenFullModal(e)}
              >
                {e.std_lastname}
              </td>

              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                onClick={() => onOpenFullModal(e)}
              >
                {e.std_id}
              </td>

              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                onClick={() => onOpenFullModal(e)}
              >
                {e.std_year}
              </td>

              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                onClick={() => onOpenFullModal(e)}
              >
                {e.std_gpa}
              </td>
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                onClick={() => onOpenFullModal(e)}
              >
                {"⭐".repeat(e.scholarship_interest || 0)} {/* .repeat() ทำซ้ำตามจำนวนในวงเล็บ */}
              </td>

              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white "
              >
                {e.is_active === 1 ? "ใช้งาน" : "ไม่มีสิทธิเข้าใช้งาน"}
              </td>

              {/* ปุ่มส่งข้อความผ่าน LINE */}
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => handleOpenLineModal(e)}
                  className="px-3 py-1 border rounded-full flex items-center gap-1 text-xs hover:bg-gray-50"
                >
                  <span>ส่งข้อความผ่าน</span>
                  <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                    LINE
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal ส่งข้อความผ่าน LINE */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              ส่งข้อความถึงนักศึกษาผ่าน LINE
            </h2>

            <p className="text-sm mb-1">
              <span className="font-medium">นักศึกษา:</span>{" "}
              {selectedStudent.std_name} {selectedStudent.std_lastname}
            </p>
            <p className="text-sm mb-3">
              <span className="font-medium">รหัสนักศึกษา:</span>{" "}
              {selectedStudent.std_id}
            </p>

            {selectedStudent.line_display_name ? (
              <>
                <p className="text-sm">
                  <span className="font-medium">
                    ชื่อบัญชี LINE ที่เชื่อมกับระบบ:
                  </span>{" "}
                  <span className="font-semibold">
                    {selectedStudent.line_display_name}
                  </span>
                </p>
                <p className="text-sm mt-2 text-gray-700">
                  กรุณาเปิดแอป{" "}
                  <span className="font-semibold">LINE Official Account</span>{" "}
                  แล้วค้นหา{" "}
                  <span className="font-semibold">
                    {selectedStudent.line_display_name}
                  </span>{" "}
                  เพื่อส่งข้อความถึงนักศึกษาโดยตรง
                </p>
              </>
            ) : (
              <p className="text-sm text-red-600">
                นักศึกษาคนนี้ยังไม่ได้เชื่อมบัญชี LINE กับระบบ
                กรุณาให้นักศึกษาพิมพ์{" "}
                <span className="font-mono">
                  "ลงทะเบียน {selectedStudent.std_id}"
                </span>{" "}
                ในห้องแชทกับบอททุนการศึกษาก่อน
              </p>
            )}

            <div className="flex justify-end mt-5">
              <button
                onClick={handleCloseLineModal}
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentTable;

// frontend/src/components/Scholarship/ScholarshipCard.jsx
import React, { useContext, useState } from "react";
import { IoIosSchool } from "react-icons/io";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BiSolidSchool } from "react-icons/bi";
import { PiEmpty } from "react-icons/pi";
import imageTU from "../../assets/Emblem_of_Thammasat_University.svg.webp";
import axiosInstance from "../../axiosInstance";
import { UserContext } from "../../UserContext";
import Modal from "../Modal";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ScholarshipCard({ scholarship, bookmarked, onBookmark, onEnroll }) {
  const API_URL = "/api/scholarships";
  const { user, token } = useContext(UserContext);

  const [stats, setStats] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const {
    scholarship_id,
    scho_name,
    scho_year,
    scho_type,
    scho_source,
    std_year,
    std_gpa,
    std_income,
    start_date,
    end_date,
    scho_file,
  } = scholarship;

  /* ---------- helper : รูปแบบเวลา ---------- */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  /* ---------- helper : รูปภาพตามแหล่งที่มา ---------- */
  const image = {
    ทุนภายใน: {
      type: "img",
      src: imageTU,
    },
    ทุนภายนอก: {
      type: "icon",
      component: (
        <BiSolidSchool className="w-18 h-18 object-cover text-[#4C1F7A]" />
      ),
    },
    default: {
      type: "icon",
      component: <IoIosSchool className="w-18 h-18 object-cover" />,
    },
  };

  /* tag สีของประเภททุน */
  const typeTag = {
    ทุนเหมาจ่าย:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 w-25",
    ทุนระยะยาว:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 w-25",
  };

  /* tag สีของแหล่งที่มา */
  const sourceTag = {
    ทุนภายใน:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 w-20",
    ทุนภายนอก:
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 w-20",
  };

  /* รูปแบบชั้นปี */
  const formatStdYear = (y) => {
    if (y < 0) return `รับเฉพาะปีที่ ${Math.abs(y)}`;
    if (y === 0) return "ทุกชั้นปี";
    return `ชั้นปีที่ ${y} ขึ้นไป`;
  };

  const imageStyles = image[scho_source] || image.default;

  /* ---------- bookmark ---------- */
  const handleBookmark = async (id) => {
    if (!token) {
      alert("กรุณาล็อกอินก่อน");
      return;
    }

    try {
      const res = await axiosInstance.post(`/api/scholarships/${id}/bookmark`);
      console.log("Bookmark success", res.data);
      setBookmarkError("");
      onBookmark?.(id);
    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.message || "ไม่สามารถบันทึกบุ๊กมาร์กได้";
      setBookmarkError(msg);
    }
  };

  /* ---------- สมัครรับข้อมูล (ส่งไป LINE) ---------- */
  const handleEnroll = async (id) => {
    if (!token) {
      alert("กรุณาล็อกอินก่อน");
      return;
    }

    try {
      const res = await axiosInstance.post(`${API_URL}/${id}/request-info`);
      console.log("Request-info success:", res.data);

      setErrMessage("");
      alert(
        res.data?.message ||
          "ระบบได้ส่งรายละเอียดทุนไปยัง LINE ของคุณเรียบร้อยแล้ว"
      );

      onEnroll?.(id);
    } catch (err) {
      const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในระบบ";
      console.log("Request-info error:", msg);
      setErrMessage(msg);
    }
  };

  /*  แสดงสถิติ คนที่ไม่ได้ log in ดูได้ */
  const showStats = async (id) => {
    try {
      const res = await axiosInstance.get(`/api/scholarships/${id}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
      setOpenModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------- กราฟวงกลม ---------- */
  const pieStats = stats
    ? {
        labels: ["ได้รับทุน", "ไม่ได้รับทุน"],
        datasets: [
          {
            data: [Number(stats.approved), Number(stats.rejected)],
            backgroundColor: ["#4CAF50", "#F44336"],
            hoverBackgroundColor: ["#66BB6A", "#EF5350"],
          },
        ],
      }
    : null;

  /* แสดง % */
  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          boxWidth: 20,
          boxHeight: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percent = ((value / total) * 100).toFixed(2);
            return `${context.label}: ${percent}%`;
          },
        },
      },
    },
  };

  /* ---------- UI ---------- */
  return (
    <section>
      <div className="hover:shadow-xl w-80 rounded-lg border-2 border-solid border-[#4C1F7A] bg-white">
        {/* ภาพ */}
        <div className="col-span-1 md:col-span-2 h-40 md:h-full overflow-hidden flex items-center justify-center mt-6 mb-1">
          {imageStyles.type === "img" ? (
            <img
              src={imageStyles.src}
              alt={scho_source}
              className="w-18 h-18 object-cover"
            />
          ) : (
            imageStyles.component
          )}
        </div>

        {/* ชื่อทุน */}
        <p className="mb-2.5 text-center text-lg">{scho_name}</p>

        {/* รายละเอียด */}
        <div className="col-span-1 md:col-span-3 flex flex-col justify-items-center mx-auto pl-12 px-12 w-full">
          <div className="text-gray-400 w-full">
            <p className="mb-1">
              ปีการศึกษา <span className="text-black">{scho_year}</span>
            </p>

            <p className="mb-1">
              ประเภท{" "}
              <span
                className={`text-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${typeTag[scho_type]}`}
              >
                {scho_type}
              </span>
            </p>

            <p className="mb-1">
              แหล่งที่มา{" "}
              <span
                className={`text-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${sourceTag[scho_source]}`}
              >
                {scho_source}
              </span>
            </p>

            <p className="mb-1">
              เกรดเฉลี่ยที่ขั้นต่ำ <span className="text-black">{std_gpa}</span>
            </p>
            <p className="mb-1">
              ชั้นปีที่ <span className="text-black">{formatStdYear(std_year)}</span>
            </p>
            <p className="mb-1">
              รายได้ขั้นต่ำ <span className="text-black">{std_income} บาท/ปี</span>
            </p>
            <p className="mb-1">
              เปิดรับ{" "}
              <span className="text-green-400">{formatDate(start_date)}</span>
            </p>
            <p className="mb-1">
              ปิดรับ{" "}
              <span className="text-red-600">{formatDate(end_date)}</span>
            </p>
          </div>

          {/* ปุ่มดูสถิติ */}
          <button
            onClick={() => showStats(scholarship_id)}
            className="py-2 px-4 mt-2 text-sm font-medium text-gray-600 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-gray-950 focus:z-10 focus:ring-0 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            ดูสถิติของทุนนี้
          </button>

          {/* modal แสดงสถิติ */}
          {openModal && (
            <Modal isOpen={true} onClose={() => setOpenModal(false)}>
              <h2 className="text-xl font-bold mb-2">{scho_name}</h2>

              {stats && (
                <div className="space-y-2">
                  {/* ถ้ายังไม่มีคนสมัครเลย */}
                  {stats.total === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-4">
                      <PiEmpty size={120} className="text-gray-300 p-1" />
                      <p className="text-gray-500 font-semibold">
                        ยังไม่มีคนสมัคร
                      </p>
                    </div>
                  ) : (
                    pieStats && (
                      <div className="w-[200px] mx-auto">
                        <Pie data={pieStats} options={options} />
                      </div>
                    )
                  )}

                  {/* จำนวนคนสมัคร */}
                  <div className="flex justify-center gap-2 mt-3 text-gray-400">
                    <p>จำนวนคนสมัครทั้งหมด:</p>
                    <p className="text-black">{stats.total} คน</p>
                  </div>

                  {/* อัตราการได้รับทุน */}
                  <div className="flex justify-center gap-2 text-gray-400">
                    <p>อัตราคนที่ได้รับทุน :</p>
                    <p className="text-black">{stats.percent}%</p>
                  </div>

                  {/* คำอธิบายทุน */}
                  {stats.desp && (
                    <div className="mt-4 px-2 text-gray-700">
                      <h3 className="font-semibold mb-1">คำอธิบายทุน:</h3>
                      <p className="max-h-[200px] overflow-y-auto  whitespace-pre-line leading-relaxed">
                        {stats.desp}
                      </p>
                    </div>
                  )}

                  {/* ดาวน์โหลดไฟล์รายละเอียดทุน */}
                  {scho_file && (
                    <a
                      href={`http://localhost:5100/uploads/${scho_file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full mt-4 px-4 py-2 rounded-lg bg-[#219B9D] text-white text-center hover:bg-[#08595b]"
                    >
                      ดาวน์โหลดเอกสาร
                    </a>
                  )}

                  {/* ตรวจสอบคุณสมบัติ */}
                  {stats.qualify && (
                    <div className="mt-4">
                      <h3 className="justify-center mx-1">
                        ผลการตรวจสอบคุณสมบัติของเบื้องต้น:
                      </h3>

                      <p className="text-gray-400 mx-1">
                        ชั้นปี:{" "}
                        <span
                          className={
                            stats.qualify.year_ok
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {stats.qualify.year_ok
                            ? "ตรงเงื่อนไข"
                            : "ไม่ตรงเงื่อนไข"}
                        </span>
                      </p>

                      <p className="text-gray-400 mx-1">
                        GPA:{" "}
                        <span
                          className={
                            stats.qualify.gpa_ok
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {stats.qualify.gpa_ok
                            ? "ตรงเงื่อนไข"
                            : "ไม่ตรงเงื่อนไข"}
                        </span>
                      </p>

                      <p className="text-gray-400 mx-1">
                        รายได้:{" "}
                        {std_income === "ไม่ได้ระบุชัดเจน" ? (
                          <span className="text-gray-600">ไม่ได้ระบุ</span>
                        ) : (
                          <span
                            className={
                              stats.qualify.income_ok
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {stats.qualify.income_ok
                              ? "ตรงเงื่อนไข"
                              : "ไม่ตรงเงื่อนไข"}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          )}

          {/* ปุ่มด้านล่าง */}
          <div className="w-full mb-8">
            <div className="flex md:mt-2 w-full">
              {/* bookmark */}
              <button
                onClick={() => handleBookmark(scholarship_id)}
                className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-purple-700 focus:z-10 focus:ring-0 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>

              {/* สมัครรับข้อมูล (ส่งรายละเอียดทุนไป LINE) */}
              <button
                onClick={() => handleEnroll(scholarship_id)}
                className="w-full flex justify-center rounded items-center px-4 py-2 ms-2 text-center text-white bg-purple-900 hover:bg-[#300758] focus:ring-0 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                สมัครรับข้อมูล
              </button>
            </div>

            {/* ข้อความ error */}
            {errMessage && (
              <p className="text-red-600 text-sm mt-2">{errMessage}</p>
            )}
            {bookmarkError && (
              <p className="text-red-600 text-sm mt-2">{bookmarkError}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScholarshipCard;

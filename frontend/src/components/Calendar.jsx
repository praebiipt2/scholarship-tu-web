import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

import axiosInstance from "../axiosInstance";

function Calender() {
  const [scholarships, setScholarships] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date()); //เก็บเดือนปัจจุบัน ไว้เพื่อกดเปลี่ยนเดือน

  /* get ทุน */
  useEffect(() => {
    const fatchData = async () => {
      try {
        const res = await axiosInstance.get("api/scholarships");
        setScholarships(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fatchData();
  }, []);

  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  /* สร้างวัน */
  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const first = new Date(year, month, 1); //หาวันที่ 1 ของเดือน
    const last = new Date(year, month + 1, 0); //หาวันสุดท้ายของเดือน

    const days = [];

    /* สร้างช่อง null ก่อนวันแรก */
    for (let i = 0; i < first.getDay(); i++) {
      days.push(null);
    }

    /* เติมวันจริงลงช่อง โดยเริ่มจากวันที่ 1 ถึง 30 */
    for (let day = 1; day <= last.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    /* สร้างช่องให้เต็มเดือน */
    const totalCells = days.length; //วันทังหมด
    const remainder = totalCells % 7;

    if (remainder !== 0) {
      const empty = 7 - remainder; //วันที่เหลือ - 7 เพื่อที่จะให้รู้ว่าต้องสร้างกี่ช่อง
      for (let i = 0; i < empty; i++) {
        days.push(null);
      }
    }

    return days;
  };

  /* ทุนมีวันไหน */
  const scholarshipsOnDate = (date) => {
    if (!date) return [];

    const d = date.toISOString().split("T")[0]; //แปลงเป็น str แล้วเอาแค่ วันที่

    return scholarships.filter((s) => {
      const matchDate = d >= s.start_date && d <= s.end_date; //ช่วงเวลาของทุน

      return matchDate;
    });
  };

  const days = generateDays();

  const [popup, setPopup] = useState(null); // pop up เวลาชี้

  /* จุดสีไว้แทนประเภททุน */
  const dotColor = (type) => {
    if (type === "ทุนเหมาจ่าย") return "bg-green-500";
    if (type === "ทุนระยะยาว") return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <section className="relative bg-stone-50 py-4 w-full">
      <div className="w-full  px-2 overflow-x-auto shadow-md rounded-md py-2">
        {/* header */}
        <div className="flex flex-col md:flex-row max-md:gap-3 items-center justify-between mb-5 ml-2">
          <div className="flex items-center gap-4">
            <h6 className="text-xl font-semibold text-gray-900">
              {/* แสดงชื่อเดือน , 543 = พศ za*/}
              {monthNames[currentMonth.getMonth()]}{" "}
              {currentMonth.getFullYear() + 543}
            </h6>
          </div>

          {/* ปุ่มเปลี่ยนเดือน */}
          <div className="flex items-center gap-3">
            <button
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-purple-700 focus:z-10 focus:ring-0 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    /* กดปุ่มแล้วจะขึ้นเดือนเก่า */
                    currentMonth.getMonth() - 1
                  )
                )
              }
            >
              ←
            </button>

            <button
              className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-purple-700 focus:z-10 focus:ring-0 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    /* กดปุ่มแล้วจะขึ้นเดือนใหม่ */
                    currentMonth.getMonth() + 1
                  )
                )
              }
            >
              →
            </button>
          </div>
        </div>

        {/* header days */}
        <div className="grid grid-cols-7 border-t border-gray-200 bg-white sticky top-0">
          {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
            <div
              key={d}
              className="p-3.5 flex items-center justify-center text-sm font-medium text-gray-900"
            >
              {d}
            </div>
          ))}
        </div>

        {/* date */}
        <div className="grid grid-cols-7 w-full">
          {days.map((day, i) => {
            const events = scholarshipsOnDate(day);

            return (
              <div
                key={i}
                className={`h-15 p-2 border border-gray-200 relative transition-all duration-300
                ${
                  events.length
                    ? "bg-purple-50 hover:bg-purple-100"
                    : "hover:bg-gray-100"
                }`}
                /* เมื่อ mouse ชี้ ให้ pop up ขึ้น */
                onMouseEnter={(e) => {
                  if (!events.length) return;
                  const rect = e.currentTarget.getBoundingClientRect(); //currentTarget = hover getBoundingClientRect = วัดตำแหน่ง
                  setPopup({
                    /* ตำแหน่งที่ pop up โผล่ */
                    x: rect.left + rect.width, //กำหนดให้ชิดซ้าย
                    y: rect.bottom, //ขอบล่าง
                    events,
                  });
                }}
                onMouseLeave={() => setPopup(null)}
              >
                {day && (
                  <>
                    <span className="text-xs font-semibold text-gray-700">
                      {day.getDate()}
                    </span>

                    {/* จุดสี */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1"> {/* ชิดกรอบล่าง */}
                      {events.map((e) => (
                        <span
                          key={e.scholarship_id}
                          className={`w-1.5 h-1.5 rounded-full ${dotColor(
                            e.scho_type
                          )}`}
                        ></span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center items-center gap-6 mt-2">
          <div className="flex items-center gap-1">
            <RiCheckboxBlankCircleFill className="text-green-500 text-xs" />
            <span>= ทุนเหมาจ่าย</span>
          </div>

          <div className="flex items-center gap-1">
            <RiCheckboxBlankCircleFill className="text-yellow-500 text-xs" />
            <span>= ทุนระยะยาว</span>
          </div>
        </div>
      </div>
      {popup &&
      /* ให้อยู่เหนือ layer ตาราง createPortal ย้ายlayer ที่ไม่ใช่ layer หลัก*/
        createPortal(
          <div
            className="fixed bg-white shadow-md p-2 rounded w-40 text-sm"
            style={{
              top: popup.y + 5, /* ให้โผล่มาใต้วัน 5px */
              left: popup.x, 
              transform: "translateX(-50%)", /* อยู่กลาง */
              zIndex: 9999, //ให้ layers อยู่บนสุด
            }}
          >
            {/* pop up แสดงชื่อทุน */}
            {popup.events.map((e) => (
              <p key={e.scholarship_id}>• {e.scho_name}</p>
            ))}
          </div>,
          document.body //document.body=  layer บนสุด
        )}
    </section>
  );
}

export default Calender;

import React from "react";
import { FaCalendarWeek } from "react-icons/fa";
import { Datepicker } from "flowbite-react";

function DateSelect({ id, label, value, onChange }) {
  /* ถ้ามีค่าให้เป็น object date เพื่อใช้ function ของ flowbite ถ้ายังไม่มีค่าให้เป็น null*/
  const dateValue = value ? new Date(value) : null;

  return (
    <div className="mt-1">
      <label
        htmlFor={id}
        className="block text-sm/6 font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <FaCalendarWeek
            className="w-4 h-4"
            aria-hidden="true"
            fill="currentColor"
          />
        </div>
        <Datepicker
          className=" text-gray-900 text-sm rounded-lg block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="เลือกวันที่"
          //locale={th}
          value={dateValue}
          onChange={(date) => {
            if (!date) {
              onChange("");
              return;
            }

            /*  const formatted = date.toISOString().split("T")[0]; */ // แปลงเป็น str เก็บเป็น 'YYYY-MM-DD' เก็บใน form

            /* toLocaleDateString = timezone en-CA เป็นรูปแบบ ปี-เดือน-วัน */
            const thaiDate = date.toLocaleDateString("en-CA", {
              timeZone: "Asia/Bangkok",
            });
            onChange(thaiDate); //ไส่ไว้แก้บัค date ไม่เข้า db
          }}
          minDate={new Date(2020, 1, 1)}
          maxDate={new Date(2030, 1, 1)}
        ></Datepicker>
      </div>
    </div>
  );
}

export default DateSelect;

import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

/* เปิดใช้งาน chartjs */
ChartJS.register(ArcElement, Tooltip, Legend);

function StudentDashboard({ reload }) {
  const [data, setData] = useState(null); //ไว้รับข้อมูลจากbackend

  const load = async () => {
    try {
      const res = await axiosInstance.get("/user/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* f5 กราฟเมื่อมีการเปลี่ยนแปลงสถานะได้รับทุน */
  useEffect(() => {
    load();
  }, [reload]);
  
  if (!data) return <p>Loading...</p>;
  if (data.total === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <h1 className="text-xl font-bold mb-4">Dashboard นักศึกษา</h1>
        <p className="text-gray-500 py-10">ยังไม่มีข้อมูล</p>
      </div>
    );
  }

  /* กราฟวงกลม */
  const pieData = {
    labels: ["ได้รับทุน", "ไม่ได้รับทุน"], //ช่องอธิบายอะไรเป็นอะไร
    datasets: [
      {
        data: [data.approved, data.rejected],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#66BB6A", "#EF5350"],
      },
    ],
  };

  const options = {
    plugins: {
      /* pop-up ที่เวลาเอาเมาส์ชี้จะขึ้น */
      tooltip: {
        /* ตัวบอกว่าจะให้โชว์อะไรบ้าง */
        callbacks: {
          label: function (context) {
            const i = context.dataIndex; //สัดส่วนกราฟ โดย 0 = ได้ทุน 1 = ไม่ได้ทุน จาก datasets

            const total = data.total || 0;
            const approved = data.approved || 0;
            const rejected = data.rejected || 0;

            /* หา % ของได้ทุนหรือไม่ได้  */
            const percentApproved =
              total > 0 ? ((approved / total) * 100).toFixed(2) : 0; // toFixed(2) = ทศนิยม 2 ตำแน่ง : 0 = ถ้าเป็น 0 ให่คืนค่า 0 dyo err
            const percentRejected =
              total > 0 ? ((rejected / total) * 100).toFixed(2) : 0;

            /* ได้รับทุน */
            if (i === 0) {
              /* รับชื่อทุนมา */
              const names = data.approvedNames.length
                ? data.approvedNames
                : "ไม่มีทุน";
              return `ได้รับ: ${names}\n(${percentApproved}%)`;

              /* ไม่ได้รับทุน */
            } else {
              const names = data.rejectedNames.length
                ? data.rejectedNames.join(", ")
                : "ไม่มีทุน";
              return `ไม่ได้รับ: ${names}\n(${percentRejected}%)`;
            }
          },
        },
      },
    },
  };

  return (
    <div className="p-6">
    <h1 className="text-xl font-bold mb-4">Dashboard นักศึกษา</h1>

    {/* แบ่งเป็น 2 col */}
    <div className="flex flex-col lg:flex-row gap-6 mt-8 px-8 pb-6">

      {/* pie chart */}
      <div className="flex flex-col items-center justify-center basis-[65%]">
        <div className="w-[330px] md:w-[380px] lg:w-[420px]">
          <Pie data={pieData} options={options} />
        </div>
        <h2 className="font-semibold items-center text-gray-500 pt-4">กราฟแสดงอัตราการได้รับทุน</h2>
      </div>

      {/* stat */}
      <div className="space-y-4 basis-[35%]">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-400 pb-1">จำนวนที่สมัครทั้งหมด</p>
          <p className="text-2xl font-semibold">{data.total}</p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-400 pb-1">ได้รับทุน</p>
          <p className="text-2xl font-bold text-green-600">
            {data.approved}
          </p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-400 pb-1">ไม่ได้รับทุน</p>
          <p className="text-2xl font-bold text-red-600">
            {data.rejected}
          </p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-400 pb-1">อัตราสำเร็จ</p>
          <p className="text-2xl font-bold">{data.percent}%</p>
        </div>
      </div>

    </div>
  </div>
  );
}

export default StudentDashboard;

import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Pie, Bar, Line } from "react-chartjs-2";

import { RiCheckboxBlankCircleFill } from "react-icons/ri";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const DashboardAdmin = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/admin/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!data) return <p>Loading...</p>;

  /* pie chart */
  const pieChart = {
    labels: ["ได้รับทุน", "ยังไม่ได้รับ"],
    datasets: [
      {
        data: [data.total_students - data.no_scholarship, data.no_scholarship],
        backgroundColor: ["#4CAF50", "#F44336"],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(2);

            return `${label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  /* bar */
  const bookmarkChart = {
    labels: data.bookmarkStats.map((x) => x.scho_name),
    datasets: [
      {
        label: "จำนวน Bookmark",
        data: data.bookmarkStats.map((x) => x.total),
        backgroundColor: "#219B9D",
        borderRadius: 8,
      },
    ],
  };

  const bookmarkOptions = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        grid: { display: false },
      },
    },
  };

  /* line */
  const lineChart = {
    labels: data.enrollByYear.map((x) => x.scho_year),
    datasets: [
      {
        label: "จำนวนผู้ได้รับทุนการศึกษาต่อปี",
        data: data.enrollByYear.map((x) => x.total),
        borderColor: "#E91E63",
        borderWidth: 3,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
      },
    },
  },
};

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col p-6">
      <h2 className="text-lg font-semibold text-center text-gray-900 p-8">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 relative">
            {/* นักศึกษาทั้งหมด */}
            <div className="flex flex-col items-center justify-center h-full border-r last:border-none border-gray-300 py-3">
              <p className="text-3xl font-bold text-[#219B9D] ">
                {data.total_students}
              </p>
              <p className="text-gray-500 text-xs mt-1">นักศึกษาทั้งหมด</p>
            </div>

            {/* ทุนทั้งหมด */}
            <div className="flex flex-col items-center justify-center  h-full border-r last:border-none border-gray-300">
              <p className="text-3xl font-bold text-[#219B9D]">
                {data.total_scholarship}
              </p>
              <p className="text-gray-500 text-xs mt-1">ทุนทั้งหมด</p>
            </div>

            {/* ทุนเหมาจ่าย */}
            <div className="flex flex-col items-center justify-center  h-full ">
              <p className="text-3xl font-bold text-[#219B9D]">
                {data.typeCount.find((x) => x.scho_type === "ทุนเหมาจ่าย")
                  ?.total || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">ทุนเหมาจ่าย</p>
            </div>

            {/* ทุนระยะยาว */}
            <div className="flex flex-col items-center justify-center h-full border-r last:border-none border-gray-300">
              <p className="text-3xl font-bold text-[#219B9D]">
                {data.typeCount.find((x) => x.scho_type === "ทุนระยะยาว")
                  ?.total || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">ทุนระยะยาว</p>
            </div>

            {/* ทุนภายใน */}
            <div className="flex flex-col items-center justify-center h-full border-r last:border-none border-gray-300">
              <p className="text-3xl font-bold text-[#219B9D]">
                {data.sourceCount.find((x) => x.scho_source === "ทุนภายใน")
                  ?.total || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">ทุนภายใน</p>
            </div>

            {/* ทุนภายนอก */}
            <div className="flex flex-col items-center justify-center h-full ">
              <p className="text-3xl font-bold text-[#219B9D]">
                {data.sourceCount.find((x) => x.scho_source === "ทุนภายนอก")
                  ?.total || 0}
              </p>
              <p className="text-gray-500 text-xs mt-1">ทุนภายนอก</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
            <h2 className=" font-semibold text-gray-900 mb-4">
              จำนวนนักศึกษาทั้งหมดแยกตามชั้นปี
            </h2>

            {[1, 2, 3, 4].map((year) => (
              <div key={year} className="mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>ชั้นปี {year}</span>
                  <span>
                    {data.studentByYear.find(
                      (x) => parseInt(x.std_year) === year
                    )?.total || 0}{" "}
                    คน
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        data.total_students
                          ? ((data.studentByYear.find(
                              (x) => parseInt(x.std_year) === year
                            )?.total || 0) /
                              data.total_students) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* pie */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="font-semibold mb-4">สัดส่วนการได้รับทุน</h2>
          <div className="w-[350px] h-[350px] mx-auto">
            <Pie data={pieChart} options={pieOptions} />
          </div>
          <span>
            <div className="flex items-center gap-1 py-2">
              <RiCheckboxBlankCircleFill className="text-green-500 text-xs" />
              <span>= จำนวนนักศึกษาที่ได้รับทุน</span>
            </div>
            <div className="flex items-center gap-1 py-1">
              <RiCheckboxBlankCircleFill className="text-red-500 text-xs" />
              <span>= จำนวนนักศึกษาที่ไม้ได้รับทุน</span>
            </div>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="font-semibold mb-4">ทุนที่ถูก Bookmark มากที่สุด</h2>
          <Bar data={bookmarkChart} options={bookmarkOptions} />
        </div>

        {/* line */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="font-semibold mb-4">จำนวนผู้ได้รับทุนการศึกษาต่อปี</h2>
          <Line data={lineChart} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;

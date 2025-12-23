import React from "react";

function EnrollList({ enrolls, onToggle }) {

  const formatDate = (dateString) => {
    const date = new Date(dateString); //รับ date จาก database
    const day = String(date.getDate()).padStart(2, "0"); //รับวันมาแปลงเป็น str เพื่อให้ใช้ padStart ได้แล้วให้แสดง 2 ตำแหน่ง ถ้ามีเลขเดียวให้เติม 0
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 เพื่อให้นับจาก 1-12 ไม่ใช่ 0-11
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; //รูปแบบ
  };

  return (
    <div >
      <h2 className="text-xl font-bold mb-4 py-4">ทุนที่สมัครรับข้อมูล</h2>

      <div className="relative overflow-x-auto shadow-md rounded-lg w-full ">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">ชื่อทุน</th>
            <th scope="col" className="px-6 py-3">ประเภททุน</th>
            <th scope="col" className="px-6 py-3">แหล่งที่มา</th>
            <th scope="col" className="px-6 py-3">วันเปิดรับสมัคร</th>
            <th scope="col" className="px-6 py-3">วันปิดรับสมัคร</th>
            <th scope="col" className="px-6 py-3">สกานะทุน</th>
            <th scope="col" className="px-6 py-3">สถานะได้รับทุน</th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {enrolls.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                ยังไม่มีการสมัครทุน
              </td>
            </tr>
          ) : (
            enrolls.map((e) => (
              <tr key={e.enroll_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {e.scho_name}
                </td>
                
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {e.scho_type}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {e.scho_source}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatDate(e.start_date)}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {formatDate(e.end_date)}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {e.is_active === 1 ?  (
                    <span className="text-green-600">เปิดรับ</span>
                  ) : (
                    <span className="text-red-600">ปิดรับแล้ว</span>
                  )}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {e.enroll_status === 1 ? (
                    <span className="text-green-600">ได้รับทุน</span>
                  ) : (
                    <span className="text-red-600">ไม่ได้รับทุน</span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer" //ซ่อน checkbox peer = toggle
                      checked={e.enroll_status === 1} // ถ้า active ให้ checkbox ติ๊กถูก
                      onChange={() => onToggle(e.enroll_id)}
                    />
                    <div
                      className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
                      peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
                      rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 relative after:content-[''] 
                      after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border
                     after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all 
                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"
                    ></div>
                  </label>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      </div>

      
    </div>
  );
}

export default EnrollList;

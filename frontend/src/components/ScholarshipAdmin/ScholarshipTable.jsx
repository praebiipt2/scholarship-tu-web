import React , { useState } from "react";
import axiosInstance from "../../axiosInstance";

function ScholarshipTable({ scholarships, onEditClick, onStatusChange , selectedId, setSelectedId}) {
  /* format ตัดเวลาออกไป ให้แสดงแค่วันที่ */
  const formatDate = (dateString) => {
    const date = new Date(dateString); //รับ date จาก database
    const day = String(date.getDate()).padStart(2, "0"); //รับวันมาแปลงเป็น str เพื่อให้ใช้ padStart ได้แล้วให้แสดง 2 ตำแหน่ง ถ้ามีเลขเดียวให้เติม 0
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 เพื่อให้นับจาก 1-12 ไม่ใช่ 0-11
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; //รูปแบบ
  };

  /* status change */
  const handleToggleStatus = async (scholarship) => {
    const newStatus = scholarship.is_active === 1 ? 0 : 1;
    try {
      await axiosInstance.patch(
        `/admin/scholarship/${scholarship.scholarship_id}`,
        { is_active: newStatus }
      );
      if (onStatusChange) {
        onStatusChange(scholarship.scholarship_id, newStatus); //short --> onStatusChange && onStatusChange(scholarship.scholarship_id, newStatus);
      }
    } catch (err) {
      console.log("Error updating status ", err);
    }
  };

  /* ติ๊กถูก all */
  const toggleAll = (e) => {
    if(e.target.checked){
      setSelectedId(scholarships.map((scholarship)=>scholarship.scholarship_id)) //map object --> element ให้แสดงบนเว็บ
    }else{
      setSelectedId([])
    }
  }

  /* ไว้ติ๊กออกใน selectedId */
  const toggleSingle = (id) => {
  if(selectedId.includes(id)) { //โดนติ๊กถูกไหม ,includes คืนค่าเป็น boolean
    setSelectedId(selectedId.filter((i) => i !== id)); //ยกเลิกติ๊กถูก , filter สร้าง array ใหม่โดยไม่เกี่ยวกับ id นั้นๆ
  }else {
    setSelectedId([...selectedId, id]); //update state ใหม่
  }
}

  return (
    <div className="relative w-full shadow-md sm:rounded-lg ">
      {/* หัวตาราง */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          {/* col */}
          <tr>
            {/* checkbox */}
            <th scope="col" className="p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  onChange={toggleAll}
                  checked={selectedId.length === scholarships.length && scholarships.length > 0} //จำนวนที่ติ๊กถูกทั้งหมด = จำนวนที่ถูกติ๊กอย่างน้อย 1 ทุน
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:outline-none  dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" id="name_scho_header" className="px-6 py-3">
              ชื่อทุนการศึกษา
            </th>

            <th scope="col" id="year_scho_header" className="px-6 py-3">
              ปีการศีกษา
            </th>

            <th scope="col" id="type_scho_header" className="px-6 py-3">
              ประเภททุน
            </th>

            <th scope="col" id="source_scho_header" className="px-6 py-3">
              แหล่งที่มาของทุน
            </th>

            <th scope="col" id="start_date_scho_header" className="px-6 py-3">
              เริ่มต้นโครงการ
            </th>

            <th scope="col" id="end_date_scho_header" className="px-6 py-3">
              สิ้นสุดโครงการ
            </th>

            <th scope="col" id="status_header" className="px-6 py-3">
              สถานะทุน
            </th>
            <th scope="col" id="" className="px-6 py-3">
              
            </th>
          </tr>
        </thead>

        {/* row */}
        <tbody>
          {scholarships.map((e) => (
            <tr
              key={e.scho_id}
              id="table_scho"
              /* onClick={() => onEditClick(e)} */ className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {/* checkbox */}
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    checked={selectedId.includes(e.scholarship_id)}
                    onChange={() => toggleSingle(e.scholarship_id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                id="name_scho"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {e.scho_name}
              </th>

              <th
                scope="row"
                id="year_scho"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {e.scho_year}
              </th>

              <th
                scope="row"
                id="type_scho"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {e.scho_type}
              </th>

              <th
                scope="row"
                id="source_scho"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {e.scho_source}
              </th>

              <th
                scope="row"
                id="start_date_scho"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {/*  แสดงเฉพาะปี-เดือน-วัน โดนไม่มี time zone
                   {e.start_date.slice(0, 10)} */}
                {formatDate(e.start_date)}
              </th>

              <th
                scope="row"
                id="end_date_scho"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {formatDate(e.end_date)}
              </th>

              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {e.is_active === 1 ? (
                    <span className="text-green-600">เปิดรับ</span>
                  ) : (
                    <span className="text-red-600">ปิดรับ</span>
                  )}
                </td>

               {/* toggle */}
              <th
                scope="row"
                id="status_scho"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer" //ซ่อน checkbox peer = toggle
                    checked={e.is_active === 1} // ถ้า active ให้ checkbox ติ๊กถูก
                    onChange={() => handleToggleStatus(e)}
                  />
                  {/* ปุม toggle */}
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
                 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 relative after:content-[''] 
                  after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
              
                </label>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScholarshipTable;

import React, { useEffect } from "react";
import axiosInstance from "../../axiosInstance";

function NewsTable({
  news,
  onEditClick,
  onStatusChange,
  selectedId,
  setSelectedId,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; //รูปแบบ
  };

  const handleToggleStatus = async (news) => {
    const newStatus = news.is_active === 1 ? 0 : 1;
    try {
      await axiosInstance.patch(`/admin/news/${news.news_id}`, {
        news_title: news.news_title, //ที่ต้องใส่ news_title บลาๆ เพราะไม่มี mappedData เหมือน scholarship ที่แค่อ้าง id ก็ใช้ได้ ทำให้ต้องส่ง news_title บลาๆด้วย
        news_content: news.news_content,
        is_active: newStatus,
      });
      if (onStatusChange) {
        onStatusChange(news.news_id, newStatus);
      }
    } catch (err) {
      console.log("Error updating status ", err);
    }
  };

  /* ติ๊กถูก all */
  const toggleAll = (e) => {
    if (e.target.checked) {
      setSelectedId(news.map((news) => news.news_id));
    } else {
      setSelectedId([]);
    }
  };

  /* ไว้ติ๊กออกใน selectedId */
  const toggleSingle = (id) => {
    if (selectedId.includes(id)) {
      setSelectedId(selectedId.filter((i) => i !== id));
    } else {
      setSelectedId([...selectedId, id]);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
      {/* หัวตาราง */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {/* col */}
          <tr>
            {/* checkbox */}
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  onChange={toggleAll}
                  checked={selectedId.length === news.length && news.length > 0}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" id="name_scho_header" className="px-6 py-3">
              ชื่อข่าว
            </th>

            <th scope="col" id="year_scho_header" className="px-6 py-3">
              วันที่โพสต์
            </th>

            <th scope="col" id="type_scho_header" className="px-6 py-3">
              อัปเดทล่าสุด
            </th>

            <th scope="col" id="type_scho_header" className="px-6 py-3">
              สถานะ
            </th>
          </tr>
        </thead>

        {/* row */}
        <tbody>
          {news.map((e) => (
            <tr
              key={e.news_id}
              id="table_news"
              /* onClick={() => onEditClick(e)} */ className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {/* checkbox */}
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    checked={selectedId.includes(e.news_id)}
                    onChange={() => toggleSingle(e.news_id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                id="news_title"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {e.news_title}
              </th>

              <th
                scope="row"
                id="created_at"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {formatDate(e.created_at)}
              </th>

              <th
                scope="row"
                id="updated_at"
                onClick={() => onEditClick(e)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {formatDate(e.updated_at)}
              </th>

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
                  <div
                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
                  peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 relative after:content-[''] 
                  after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"
                  ></div>
                </label>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NewsTable;

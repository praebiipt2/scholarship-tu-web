// frontend/src/pages/NotiStudent.jsx
import { useEffect, useState, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../UserContext";

//  map code ใน DB -> ข้อความภาษาไทยสวย ๆ
const NOTI_LABEL_MAP = {
  new_scholarship: "มีทุนการศึกษาใหม่ สามารถดูในหน้าทุนการศึกษา",
  line_sent_detail: "ระบบส่งรายละเอียดทุนการศึกษาให้คุณทาง LINE เรียบร้อยแล้ว",
  new_news: "มีข่าวประชาสัมพันธ์ใหม่จากสาขา",
};

function getNotiLabel(type) {
  return NOTI_LABEL_MAP[type] || type; // ถ้าไม่มีใน map ก็ fallback เป็นค่าเดิม
}

function NotiStudent() {
  const { token } = useContext(UserContext); // เอา JWT จาก context
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // 1) ดึง list การแจ้งเตือนของนักศึกษา
        const res = await axiosInstance.get("/api/notifications/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("notifications data:", res.data);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("load notifications error:", err);
        setError("ไม่สามารถโหลดการแจ้งเตือนได้");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  // คลิกที่แจ้งเตือน 1 อัน = mark ว่าอ่าน + รีโหลดให้ navbar เคลียร์จุดแดง
  const handleClickNotification = async (noti) => {
    try {
      await axiosInstance.post(
        `/api/notifications/${noti.std_noti_id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // อัปเดต state ฝั่ง frontend ให้ badge "ยังไม่อ่าน" หายไปเฉพาะอันที่กด
      setNotifications((prev) =>
        prev.map((n) =>
          n.std_noti_id === noti.std_noti_id ? { ...n, is_read: 1 } : n
        )
      );

      // ให้ navbar เรียก unread-count ใหม่แบบง่ายสุด
      window.location.reload();
    } catch (err) {
      console.error("click noti error:", err);
    }
  };

  //  ปุ่มลบแจ้งเตือน 1 อัน
  const handleDeleteNotification = async (noti, e) => {
    // กันไม่ให้ไป trigger onClick ของ li (ที่ mark read)
    e.stopPropagation();

    const confirmDelete = window.confirm("ต้องการลบการแจ้งเตือนนี้หรือไม่?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/notifications/${noti.std_noti_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // เอาออกจาก state ทันที
      setNotifications((prev) =>
        prev.filter((n) => n.std_noti_id !== noti.std_noti_id)
      );

      // ให้ navbar อัปเดต count ใหม่
      window.location.reload();
    } catch (err) {
      console.error("delete noti error:", err);
      alert("ไม่สามารถลบการแจ้งเตือนได้");
    }
  };

  if (loading) {
    return <div className="p-4">กำลังโหลดการแจ้งเตือน...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!notifications.length) {
    return <div className="p-4">ยังไม่มีการแจ้งเตือนทุนการศึกษา</div>;
  }

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto p-4 ">
        <h2 className="text-lg font-semibold text-center px-8 text-gray-900 p-8">
          การแจ้งเตือนทุนการศึกษาของคุณ
        </h2>

        <ul className="space-y-3">
          {notifications.map((noti) => (
            <li
              key={noti.std_noti_id}
              onClick={() => handleClickNotification(noti)} // คลิกการ์ด = mark read
              className="border border-slate-200 rounded-lg p-3 bg-white shadow-sm flex justify-between items-start text-sm cursor-pointer hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="font-medium">
                  {getNotiLabel(noti.std_noti_type)}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {new Date(noti.created_at).toLocaleString("th-TH")}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {!noti.is_read && (
                  <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                    ยังไม่อ่าน
                  </span>
                )}

                {/* ปุ่มลบ */}
                <button
                  onClick={(e) => handleDeleteNotification(noti, e)}
                  className="text-xs border border-red-400 text-red-500 rounded-full px-3 py-0.5 hover:bg-red-50"
                >
                  ลบ
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NotiStudent;

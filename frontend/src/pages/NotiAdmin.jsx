// frontend/src/pages/NotiAdmin.jsx
import { useEffect, useState, useContext } from "react";
import axiosInstance from "../axiosInstance";
import { UserContext } from "../UserContext";

// ข้อความพื้นฐานตาม noti_type (ใช้เป็น fallback)
const ADMIN_NOTI_LABEL_MAP = {
  student_request_info: "มีนักศึกษาขอรายละเอียดทุนการศึกษา",
  student_message: "มีข้อความสอบถามใหม่จากนักศึกษา",
  line_contact: "มีนักศึกษาติดต่อเจ้าหน้าที่ผ่าน LINE",
};

// ใช้ทั้ง noti object เพื่อดึงชื่อ + รหัสนักศึกษา + ชื่อ LINE
function getAdminNotiLabel(noti) {
  const fullName =
    noti.std_name && noti.std_lastname
      ? `${noti.std_name} ${noti.std_lastname}`
      : "นักศึกษาไม่ทราบชื่อ";

  const stdCode = noti.std_id ? ` (รหัส ${noti.std_id})` : "";

  const lineName = noti.line_display_name
    ? ` / LINE: ${noti.line_display_name}`
    : "";

  switch (noti.noti_type) {
    case "student_request_info":
      return `นักศึกษาชื่อ ${fullName}${stdCode}${lineName} ขอรายละเอียดทุนการศึกษา`;
    case "student_message":
      return `นักศึกษาชื่อ ${fullName}${stdCode}${lineName} ส่งข้อความสอบถามเพิ่มเติม`;
    case "line_contact":
      return `นักศึกษาชื่อ ${fullName}${stdCode}${lineName} ติดต่อเจ้าหน้าที่ผ่าน LINE`;
    default:
      // ถ้า type อื่น ๆ ที่ยังไม่ได้แมป ก็ใช้ค่า fallback
      return ADMIN_NOTI_LABEL_MAP[noti.noti_type] || noti.noti_type;
  }
}

function NotiAdmin() {
  const { token } = useContext(UserContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โหลดรายการแจ้งเตือนเจ้าหน้าที่
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("admin notifications:", res.data);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("load admin notifications error:", err);
        setError("ไม่สามารถโหลดการแจ้งเตือนของเจ้าหน้าที่ได้");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  // คลิกการ์ด = mark ว่าอ่านแล้ว
  const handleClickNotification = async (noti) => {
    try {
      await axiosInstance.post(
        `/api/admin/notifications/${noti.adm_noti_id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // อัปเดต state ให้ is_read เปลี่ยนเฉพาะอันที่คลิก
      setNotifications((prev) =>
        prev.map((n) =>
          n.adm_noti_id === noti.adm_noti_id ? { ...n, is_read: 1 } : n
        )
      );

      // ให้ Navbar ดึง unread-count ใหม่แบบง่ายสุด
      window.location.reload();
    } catch (err) {
      console.error("click admin noti error:", err);
    }
  };

  // ปุ่มลบแจ้งเตือน
  const handleDeleteNotification = async (noti, e) => {
    e.stopPropagation(); // กันไม่ให้ไป trigger click การ์ด

    const ok = window.confirm("ต้องการลบการแจ้งเตือนนี้หรือไม่?");
    if (!ok) return;

    try {
      await axiosInstance.delete(
        `/api/admin/notifications/${noti.adm_noti_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ลบออกจาก state
      setNotifications((prev) =>
        prev.filter((n) => n.adm_noti_id !== noti.adm_noti_id)
      );

      window.location.reload();
    } catch (err) {
      console.error("delete admin noti error:", err);
      alert("ไม่สามารถลบการแจ้งเตือนได้");
    }
  };

  // ---------- UI ----------

  if (loading) {
    return <div className="p-4">กำลังโหลดการแจ้งเตือนของเจ้าหน้าที่...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!notifications.length) {
    return <div className="p-4">ยังไม่มีการแจ้งเตือนของเจ้าหน้าที่</div>;
  }

  return (
    <div className="p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-lg font-semibold text-center px-8 text-gray-900 p-8">
          การแจ้งเตือนของเจ้าหน้าที่
        </h2>

        <ul className="space-y-3">
          {notifications.map((noti) => (
            <li
              key={noti.adm_noti_id}
              onClick={() => handleClickNotification(noti)}
              className="border border-slate-200 rounded-lg p-3 bg-white shadow-sm flex justify-between items-start text-sm cursor-pointer hover:bg-gray-50"
            >
              <div>
                {/* ข้อความหลัก: รวมชื่อ + รหัสนักศึกษา + ชื่อ LINE */}
                <div className="font-medium">{getAdminNotiLabel(noti)}</div>

                {/* เวลา */}
                <div className="text-gray-500 text-xs mt-1">
                  {new Date(noti.created_at).toLocaleString("th-TH")}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* badge ยังไม่อ่าน */}
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

export default NotiAdmin;

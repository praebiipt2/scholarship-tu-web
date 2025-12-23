// frontend/src/components/LineAddFriendBox.jsx
import { FaLine } from "react-icons/fa";

const lineAddFriendUrl = "https://lin.ee/Ihe7CSq"; // เอาลิงก์เพิ่มเพื่อนจริงมาใส่ตรงนี้

function LineAddFriendBox() {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="max-w-xl w-full bg-[#F5FFF8] border border-[#3AC569] rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
        {/* ด้านซ้าย : ข้อความอธิบายสั้น ๆ */}
        <div className="flex flex-col gap-1 text-sm text-gray-800">
          <div className="font-semibold text-base text-[#137C3A]">
            เชื่อมต่อ LINE เพื่อรับข่าวสารทุนการศึกษา
          </div>
          <ol className="list-decimal list-inside text-xs text-gray-700 mt-1 space-y-0.5">
            <li>กดปุ่ม “เพิ่มเพื่อน LINE OA” ด้านขวา</li>
            <li>
              พิมพ์ข้อความ
              <span className="mx-1 font-mono bg-white border rounded px-1 py-0.5">
                ลงทะเบียน รหัสนักศึกษา
              </span>
              ในห้องแชทกับ OA
            </li>
            <li>รอข้อความยืนยันจากระบบว่าเชื่อมต่อสำเร็จ</li>
          </ol>
        </div>

        {/* ด้านขวา : ปุ่มเพิ่มเพื่อน */}
        <a href={lineAddFriendUrl} target="_blank" rel="noreferrer">
          <button className="flex flex-col items-center gap-1 bg-[#06C755] hover:bg-[#04b348] text-white text-xs font-semibold px-4 py-2 rounded-full shadow">
            <span className="flex items-center gap-1">
              <FaLine className="text-base" />
              <span>เพิ่มเพื่อน LINE OA</span>
            </span>
            <span className="opacity-90">@138vdzim</span>
          </button>
        </a>
      </div>
    </div>
  );
}

export default LineAddFriendBox;

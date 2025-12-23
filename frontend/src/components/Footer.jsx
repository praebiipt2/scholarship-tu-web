import React from "react";
import { FaPhoneAlt, FaFax, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Footer() {
  return (
    <footer className = "bg-[#FF8000] text-white py-8 z-50">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-25 ">
        {/* Title */}
        <h3 className="text-xl font-bold mb-4">ติดต่อ</h3>

        {/* Address */}
        <p className="leading-relaxed mb-4">
          สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต
          <br />
          อาคารบรรยายรวม 2 คณะวิทยาศาสตร์และเทคโนโลยี
          <br />
          ปทุมธานี 12120
        </p>


        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FaPhoneAlt />
            <span>โทรศัพท์ : 0-2986-9154, 0-2986-9156, 0-2986-9138-39</span>
          </div>

          <div className="flex items-center gap-2">
            <FaFax />
            <span>โทรสาร : 0-2986-9157</span>
          </div>

          <div className="flex items-center gap-2">
            <MdEmail />
            <span>Email : scitu_cs@sci.tu.ac.th</span>
          </div>

          <div className="flex items-center gap-2">
            <FaFacebook />
            <span>Facebook : @CSTUadmissioncenter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

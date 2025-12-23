import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

import Logo from "../assets/CSLogo-Square-White.png";

import InputBox from "../components/input/InputBox";
import Button from "../components/button/ButtonSummit";

function Register() {
  const [inputData, setInputData] = useState({
    firstName: "",
    lastName: "",
    year: "",
    StdId: "",
    gpa: "",
    income: "",
    scholarship_interest: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSummit = async (e) => {
    e.preventDefault();

    if (inputData.password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/register", inputData);
      setMessage(response.data.message);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Server error or cannot reach API");
      }
    }
  };

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // เอาไว้โชว์ error

  return (
    <div className="min-h-full min-w-full bg-linear-to-tr from-amber-200 via-amber-200 to-red-400 flex items-center justify-center px-6 py-12 ">
      <div className="flex w-200 h-max flex-col justify-center px-6 py-12 lg:px-8 bg-white rounded-xl shadow-xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={Logo} alt="" className="mx-auto h-20 w-auto" />
          <h2 className="mt-7 text-center text-2xl/9 font-bold tracking-tight text-black">
            ลงทะเบียน
          </h2>
        </div>
        {message && (
          <p className="text-center text-red-600 mt-2 text-sm">{message}</p>
        )}

        <form onSubmit={handleSummit} className="space-y-6 space-x-6">
          <div className="grid gap-6 mt-4 md:grid-cols-2">
            <InputBox
              id="firstName"
              label="ชื่อ"
              type="text"
              name="firstName"
              placeholder="สมศรี"
              required
              autoComplete="given-name"
              maxLength={15}
              pattern="text"
              value={inputData.firstName}
              onChange={(e) =>
                setInputData({ ...inputData, firstName: e.target.value })
              }
            />
            <InputBox
              id="lastName"
              label="นามสกุล"
              type="text"
              name="lastName"
              placeholder="กวางทอง"
              required
              autoComplete="family-name"
              maxLength={20}
              pattern="text"
              value={inputData.lastName}
              onChange={(e) =>
                setInputData({ ...inputData, lastName: e.target.value })
              }
            />
            <InputBox
              id="StdId"
              label="รหัสนักศึกษา"
              type="number"
              name="StdId"
              placeholder=""
              required
              autoComplete="off"
              maxLength={10}
              pattern="number"
              value={inputData.StdId}
              onChange={(e) =>
                setInputData({ ...inputData, StdId: e.target.value })
              }
            />

            <InputBox
              id="year"
              label="ชั้นปีที่"
              type="number"
              name="year"
              placeholder=""
              autoComplete="off"
              options={["1", "2", "3", "4"]}
              value={inputData.year}
              onChange={(e) =>
                setInputData({ ...inputData, year: e.target.value })
              }
            />
            <InputBox
              id="gpa"
              label="gpa"
              type="text"
              name="gpa"
              placeholder="3.00"
              required
              autoComplete="off"
              maxLength={4}
              pattern="decimal"
              value={inputData.gpa}
              onChange={(e) =>
                setInputData({ ...inputData, gpa: e.target.value })
              }
            />
            <InputBox
              id="income"
              label="รายได้ต่อปี"
              type="number"
              name="std_income"
              placeholder=""
              pattern="number"
              value={inputData.income}
              onChange={(e) =>
                setInputData({ ...inputData, income: e.target.value })
              }
            />

            <InputBox
              id="scholarship_interest"
              label="ความสนใจในการสมัครทุน"
              type="number"
              name="scholarship_interest"
              placeholder=""
              autoComplete="off"
              options={[
                { label: "⭐", value: 1 },
                { label: "⭐⭐", value: 2 },
                { label: "⭐⭐⭐", value: 3 },
                { label: "⭐⭐⭐⭐", value: 4 },
                { label: "⭐⭐⭐⭐⭐", value: 5 },
              ]}
              value={inputData.scholarship_interest}
              onChange={(e) =>
                setInputData({
                  ...inputData,
                  scholarship_interest: e.target.value,
                })
              }
            />
            <InputBox
              id="email"
              label="Email"
              type="text"
              name="email"
              placeholder="somsri.mon@dome.tu.ac.th"
              required
              autoComplete="email"
              maxLength={40}
              pattern=""
              value={inputData.email}
              onChange={(e) =>
                setInputData({ ...inputData, email: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <InputBox
              id="password"
              label="รหัสผ่าน"
              type="password"
              name="password"
              placeholder=""
              required
              maxLength={10}
              pattern=""
              value={inputData.password}
              onChange={(e) =>
                setInputData({ ...inputData, password: e.target.value })
              }
            />
            <InputBox
              id="confirmPassword"
              label="ยืนยันรหัสผ่าน"
              type="password"
              name="confirmPassword"
              placeholder=""
              required
              maxLength={10}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          <div className="mt-9">
            <Button type="submit" primary={true}>
              ลงทะเบียน
            </Button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm/6 text-gray-400">
          <Link to="/" className="text-[#FF8000] hover:text-[#FFA300]">
            กลับหน้าแรก
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

import React, { useState, useContext } from "react";
import Logo from "../assets/CSLogo-Square-White.png";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import Button from "../components/button/ButtonSummit";
import InputBox from "../components/input/InputBox";
import { UserContext } from "../UserContext";
function Login() {
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(UserContext);

  const handleSummit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", inputData);
      /* เก็บ token role ไว้ในเครื่อง */
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      setMessage(response.data.message);
      console.log(response.data);
      setToken(response.data.token);
      setUser(response.data.user);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <div className="min-h-full min-w-full h-max bg-gradient-to-tr from-amber-200 via-amber-200 to-red-400 flex items-center justify-center px-6 py-12 ">
      <div className="flex w-120 h-max flex-col justify-center px-6 py-12 lg:px-8 bg-white rounded-xl shadow-xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={Logo} alt="" className="mx-auto h-20 w-auto" />
          <h2 className="mt-7 text-center text-2xl/9 font-bold tracking-tight text-black">
            เข้าสู่ระบบ
          </h2>
        </div>

        {message && (
          <p className="text-center text-red-600 mt-2 text-sm">{message}</p>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSummit} className="space-y-6">
            <div>
              <div className="mt-1">
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
            </div>

            <div>
              <div className="flex items-center justify-between"></div>
              <div className="mt-1">
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
              </div>
            </div>

            <div className="mt-9">
              <Button type="submit" primary={true}>
                เข้าสู่ระบบ
              </Button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm/6 text-gray-400">
            <Link
              to="/register"
              className="font-semibold text-[#FF8000] hover:text-[#FFA300]"
            >
              ลงทะเบียนเพื่อเข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

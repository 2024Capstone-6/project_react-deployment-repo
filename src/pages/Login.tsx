import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();

  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/userdt/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Email,
          password: Password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // localStorage.setItem("access_token", data.access_token) // JWT 토큰 로컬 스토리지에 저장
        sessionStorage.setItem("Email", data.email);
        sessionStorage.setItem("Nickname", data.nickname);
        sessionStorage.setItem("UserId", data.id);
        setUser(data.nickname); // 로그인 성공 시 사용자 이름 저장
        navigate("/"); // 메인 페이지로 이동
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Invalid email or password.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while trying to log in. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Log in</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={Email}
            onChange={emailHandler}
            placeholder="Enter your Email"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="Password"
            value={Password}
            onChange={passwordHandler}
            placeholder="Enter your password"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
        <div className="mb-6">
          <button
            onClick={handleLogin}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
        <div className="text-center">
          <a href="/Signup" className="text-blue-500 hover:underline">Make your Email</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
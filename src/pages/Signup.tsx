import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [Nickname, setNickname] = useState("");
  const [errorNickname, setErrorNickname] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const [Email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const [Password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [PasswordDouble, setPasswordDouble] = useState("");
  const [errorPasswordDouble, setErrorPasswordDouble] = useState("");
  const [isPasswordDoubleValid, setIsPasswordDoubleValid] = useState(false);

  // 닉네임 중복 확인 및 정규식 검사
  const checkNickname = async () => {
    try {
      const response = await fetch(`http://localhost:3001/userdt/check-nickname?nickname=${Nickname}`);
      const data = await response.json();
  
      if (!data.valid) {
        setErrorNickname("Please check enter 3 to 10 characters.");
        setIsNicknameChecked(false);
      } else if (!data.available) {
        setErrorNickname("Nickname is already taken.");
        setIsNicknameChecked(false);
      } else {
        setErrorNickname("Nickname is available.");
        setIsNicknameChecked(true);
      }
    } catch (error) {
      console.error("Error checking nickname:", error);
      setErrorNickname("An error occurred. Please try again.");
    }
  };

  // 이메일 중복 확인 및 정규식 검사
  const checkEmail = async () => {
    try {
      const response = await fetch(`http://localhost:3001/userdt/check-email?email=${Email}`);
      const data = await response.json();
  
      if (!data.valid) {
        setErrorEmail("Please enter a valid email address.");
        setIsEmailChecked(false);
      } else if (!data.available) {
        setErrorEmail("Email is already taken.");
        setIsEmailChecked(false);
      } else {
        setErrorEmail("Email is available.");
        setIsEmailChecked(true);
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setErrorEmail("An error occurred. Please try again.");
    }
  };

  // 비밀번호 유효성 검사
  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;

    if (passwordRegex.test(e.currentTarget.value)) {
      setErrorPassword("");
      setIsPasswordValid(true);
    } else {
      setErrorPassword("Password must be at least 6 characters, including letters and numbers.");
      setIsPasswordValid(false);
    }
  };

  // 비밀번호 확인 로직
  const passwordDoubleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordDouble(e.currentTarget.value);
  };

  useEffect(() => {
    if (Password === PasswordDouble) {
      setErrorPasswordDouble("");
      setIsPasswordDoubleValid(true);
    } else {
      setErrorPasswordDouble("Passwords do not match.");
      setIsPasswordDoubleValid(false);
    }
  }, [Password, PasswordDouble]);

  const submitButton = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNicknameChecked || !isEmailChecked || !isPasswordValid || !isPasswordDoubleValid) {
      alert("Please complete all fields and ensure data is valid before submitting.");
      return;
    }

    const userData = {
      nickname: Nickname,
      email: Email,
      password: Password,
    };

    try {
      const response = await fetch("http://localhost:3001/userdt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate("/Login");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen m-auto bg-gray-100">
      <div className="w-1/2 bg-white p-20 rounded-lg shadow-lg">
        <form className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign up</h2>
          <div className="mb">
            <label className="block font-medium mb-1">Nickname</label>
            <input
              type="text"
              name="Nickname"
              value={Nickname}
              onChange={(e) => setNickname(e.currentTarget.value)}
              onBlur={checkNickname}
              placeholder="Please enter 3 to 10 characters"
              className="border p-3 w-full rounded-md"
            />
            {errorNickname && (
              <p className={errorNickname === "Nickname is available." ? "text-blue-600" : "text-red-600"}>
                {errorNickname}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="Email"
              value={Email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              onBlur={checkEmail}
              placeholder="example@example.com"
              className="border p-3 w-full rounded-md"
            />
            {errorEmail && (
              <p className={errorEmail === "Email is available." ? "text-blue-600" : "text-red-600"}>
                {errorEmail}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="Password"
              value={Password}
              onChange={passwordHandler}
              placeholder="At least 6 characters with letters and numbers"
              className="border p-3 w-full rounded-md"
            />
            {errorPassword && <p className="text-red-600">{errorPassword}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="PasswordDouble"
              value={PasswordDouble}
              onChange={passwordDoubleHandler}
              placeholder="Re-enter your Password"
              className="border p-3 w-full rounded-md"
            />
            {errorPasswordDouble && <p className="text-red-600">{errorPasswordDouble}</p>}
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={submitButton}
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
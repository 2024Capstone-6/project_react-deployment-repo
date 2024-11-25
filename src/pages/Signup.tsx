import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [Nickname, setNickname] = useState("");
  const [errorNickname, setErrorNickname] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const [Email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const [Password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [PasswordDouble, setPasswordDouble] = useState("");
  const [errorPasswordDouble, setErrorPasswordDouble] = useState("");
  const [isPasswordDoubleValid, setIsPasswordDoubleValid] = useState(false);

  const nicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.currentTarget.value);
    const nicknameRegex = /^[a-zA-Z가-힣0-9]{3,10}$/;

    if (nicknameRegex.test(e.currentTarget.value)) {
      setIsNicknameValid(true);
      setErrorNickname("");
    } else {
      setErrorNickname("Please enter the nickname in 3 to 10 characters.");
      setIsNicknameValid(false);
    }
    setIsNicknameChecked(false);
  };

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(e.currentTarget.value)) {
      setErrorEmail("");
      setIsEmailValid(true);
    } else {
      setErrorEmail("Please enter a valid email.");
      setIsEmailValid(false);
    }
    setIsEmailChecked(false);
  };

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

  const checkNickname = async () => {
    if (!isNicknameValid) {
      alert("Please enter a valid nickname before checking.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/userdt/check-nickname?nickname=${Nickname}`);
      const data = await response.json();
      if (data.available) {
        setErrorNickname("Nickname is available.");
        setIsNicknameChecked(true);
      } else {
        setErrorNickname("Nickname is already taken.");
        setIsNicknameChecked(false);
      }
    } catch (error) {
      console.error("Error checking nickname:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const checkEmail = async () => {
    if (!isEmailValid) {
      alert("Please enter a valid email before checking.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/userdt/check-email?email=${Email}`);
      const data = await response.json();
      if (data.available) {
        setErrorEmail("Email is available.");
        setIsEmailChecked(true);
      } else {
        setErrorEmail("Email is already taken.");
        setIsEmailChecked(false);
      }
    } catch (error) {
      console.error("Error checking email:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const submitButton = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !isNicknameValid || 
      !isEmailValid || 
      !isPasswordValid || 
      !isPasswordDoubleValid || 
      !isNicknameChecked || 
      !isEmailChecked
    ) {
      alert("Please enter valid information and check nickname/email duplication.");
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
          <div className="mb-4">
            <label className="block font-medium mb-1">Nickname</label>
            <div className="flex">
              <input
                type="text"
                name="Nickname"
                value={Nickname}
                onChange={nicknameHandler}
                className="border p-3 w-full rounded-md"
              />
              <button type="button" onClick={checkNickname} className="ml-2 bg-gray-800 text-white px-4 py-2 rounded-md">
                Check
              </button>
            </div>
            {errorNickname && (
              <p className={errorNickname === "Nickname is available." ? "text-blue-600" : "text-red-600"}>
                {errorNickname}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Email</label>
            <div className="flex">
              <input
                type="email"
                name="email"
                value={Email}
                onChange={emailHandler}
                className="border p-3 w-full rounded-md"
              />
              <button type="button" onClick={checkEmail} className="ml-2 bg-gray-800 text-white px-4 py-2 rounded-md">
                Check
              </button>
            </div>
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
              className="border p-3 w-full rounded-md"
            />
            {errorPassword && <p className="text-red-600">{errorPassword}</p>}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Check your Password</label>
            <input
              type="password"
              name="PasswordDouble"
              value={PasswordDouble}
              onChange={passwordDoubleHandler}
              className="border p-3 w-full rounded-md"
            />
            {errorPasswordDouble && <p className="text-red-600">{errorPasswordDouble}</p>}
          </div>
          <div className="mt-6">
            <button type="button" onClick={submitButton} className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold">
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
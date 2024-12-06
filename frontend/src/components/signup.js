import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isVisible, setIsVisible] = useState(false);

  // Validation states
  const [isValid, setIsValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

  // "Touched" states
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);

  const navigate = useNavigate();

  async function handlesignup() {
    try {
      await createUserWithEmailAndPassword(auth, username, password);
      console.log("User signed up");
      alert("User signed up successfully");

      const response = await axios.post("http://localhost:5000/api/signup", {
        username,
        password,
      });
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("User already signed up. Redirecting to login page.");
        navigate("/login");
      } else {
        console.error("Error during signup:", error);
        alert("An error occurred. Please try again.");
      }
    }
  }

  function handleEmail(e) {
    const email = e.target.value;
    setUsername(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
  }

  function handlePassword(e) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const pwd = e.target.value;
    setPassword(pwd);
    setIsPasswordValid(passwordRegex.test(pwd));
  }

  function handleConfirmPassword(e) {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
    setIsConfirmPasswordValid(confirmPwd === password);
  }

  const toggleVisibility = () => {
    setIsVisible((prevVisible) => !prevVisible);
  };

  // Check if all fields are valid
  const areFieldsValid =
    username.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    isValid &&
    isPasswordValid &&
    isConfirmPasswordValid;

  return (
    <div
      style={{
        backgroundImage: "url('/assets/loginbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflowX: "hidden",
      }}
    >
      <div className="flex items-center justify-center min-h-screen bg-opacity-50 px-4">
        <div className="w-full max-w-md p-6 sm:p-8 space-y-6 rounded-lg bg-gray-800 bg-opacity-40 shadow-md">
          <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>

          <form className="space-y-4" noValidate>
            <div>
              <label
                className="block text-sm font-medium text-white"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="email"
                id="username"
                value={username}
                onChange={handleEmail}
                onBlur={() => setIsEmailTouched(true)}
                required
                className={`w-full px-4 py-2 mt-1 text-white bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
                  isEmailTouched && !isValid
                    ? "focus:ring-red-500 border-red-500"
                    : "focus:ring-gray-700"
                }`}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-white"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={isVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePassword}
                  onBlur={() => setIsPasswordTouched(true)}
                  required
                  className={`w-full px-4 py-2 mt-1 text-white bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
                    isPasswordTouched && !isPasswordValid
                      ? "focus:ring-red-500 border-red-500"
                      : "focus:ring-gray-700"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  onClick={toggleVisibility}
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"
                >
                  {isVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-white"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={isVisible ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPassword}
                  onBlur={() => setIsConfirmPasswordTouched(true)}
                  required
                  className={`w-full px-4 py-2 mt-1 text-white bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
                    isConfirmPasswordTouched && !isConfirmPasswordValid
                      ? "focus:ring-red-500 border-red-500"
                      : "focus:ring-gray-700"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  onClick={toggleVisibility}
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"
                >
                  {isVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Show the Sign Up button only when all fields are valid */}
            {areFieldsValid && (
              <button
                type="button"
                className="w-full px-4 py-2 text-white bg-orange-500 rounded-md transition duration-150 hover:bg-orange-600 focus:bg-orange-600 focus:ring-gray-700"
                onClick={handlesignup}
              >
                Sign Up
              </button>
            )}
          </form>
          <p className="text-sm text-center text-white">
            Already have an account?{" "}
            <a
              href="/login"
              className="hover:underline"
              style={{ color: "#AB0509" }}
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

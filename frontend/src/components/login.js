import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [isValid, setIsValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks form submission

  const navigate = useNavigate();

  const loginuser = () => {
    setIsSubmitted(true); // Mark the form as submitted

    if (isValid && isPasswordValid && isConfirmPasswordValid) {
      signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const uid = user.uid;

          if (user.accessToken) {
            localStorage.setItem("userToken", user.accessToken);
          }

          navigate("/home", { state: { uid: uid }, replace: true });
          alert("Login Successful");
        })
        .catch((error) => {
          handleFirebaseErrors(error);
        });
    }
  };

  const handleFirebaseErrors = (error) => {
    switch (error.code) {
      case "auth/invalid-credential":
        alert("No account found. Please sign up first.");
        break;
      case "auth/wrong-password":
        alert("Incorrect password.");
        break;
      case "auth/invalid-email":
        alert("Invalid email format.");
        break;
      default:
        alert("An error occurred. Try again later.");
        console.error(error);
    }
  };

  const handleEmail = (e) => {
    const email = e.target.value;
    setUsername(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
  };

  const handlePassword = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setIsPasswordValid(passwordRegex.test(pwd));
  };

  const handleConfirmPassword = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
    setIsConfirmPasswordValid(confirmPwd === password);
  };

  const toggleVisibility = () => {
    setIsVisible((prevVisible) => !prevVisible);
  };

  const allFieldsFilled =
    username.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  const allFieldsValid =
    allFieldsFilled && isValid && isPasswordValid && isConfirmPasswordValid;

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
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-40 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-white">Login</h2>
          <form className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm text-white" htmlFor="username">
                Username
              </label>
              <input
                type="email"
                id="username"
                value={username}
                onChange={handleEmail}
                className={`w-full px-4 py-2 text-white bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
                  isSubmitted && !isValid
                    ? "focus:ring-red-500 border-red-500"
                    : "focus:ring-gray-700"
                }`}
                placeholder="Enter your email"
              />
              {isSubmitted && !isValid && (
                <p className="text-sm text-red-500">Enter a valid email.</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-white" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={isVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePassword}
                  className={`w-full px-4 py-2 text-white bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
                    isSubmitted && !isPasswordValid
                      ? "focus:ring-red-500 border-red-500"
                      : "focus:ring-gray-700"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  onClick={toggleVisibility}
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                >
                  {isVisible ? "Hide" : "Show"}
                </button>
              </div>
              {isSubmitted && !isPasswordValid && (
                <p className="text-sm text-red-500">
                  Password must include 8 characters, uppercase, number, and
                  special character.
                </p>
              )}
            </div>

            {/* Confirm Password Field */}

            <div>
              <label
                className="block text-sm text-white"
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
                className={`w-full px-4 py-2 text-white bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
                  isSubmitted && !isConfirmPasswordValid
                    ? "focus:ring-red-500 border-red-500"
                    : "focus:ring-gray-700"
                }`}
                placeholder="Confirm your password"
              />
              {isSubmitted && !isConfirmPasswordValid && (
                <p className="text-sm text-red-500">Passwords do not match.</p>
              )}
           
            <button
                    onClick={toggleVisibility}
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white focus:outline-none"
                  >
                    {isVisible ? "Hide" : "Show"}
                  </button>
            </div>
            </div>
          

            {/* Conditionally Render Login Button */}
            {allFieldsValid && (
              <button
                type="button"
                className="w-full px-4 py-2 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                onClick={loginuser}
              >
                Login
              </button>
            )}
          </form>
          <p className="text-sm text-center text-white mt-4">
              Don't  have an account?{" "}
              <a
                href="/signup"
                className="hover:underline"
                style={{ color: "#AB0509" }}
              >
                Signup here
              </a>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

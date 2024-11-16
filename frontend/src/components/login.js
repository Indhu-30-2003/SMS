import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import auth from "../firebase";
import { useNavigate } from "react-router-dom";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  /* useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        console.log("user Loged in");
        navigate("/home");
      } else {
        console.log("user Logged out");
      }
    });
  }); */

  // login component authenticates using signInWithEmailAndPassword function in firebase
  function loginuser() {
    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        console.log("user Login Successful");
        navigate("/home");
        alert("Login Successful");
      })
      .catch(() => {
        console.log("user Login failed");
        alert("Please enter correct Login details");
      });
  }

  //password toggle
  const toggleVisibility = () => {
    setIsVisible(prevVisible => !prevVisible);
  };
  
  return (
    <>
  <nav className="shadow-md p-4 flex justify-center sm:justify-start">
    <h1 className="text-blue-600 text-2xl font-bold">Student Management System</h1>
  </nav>

  <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

      <form className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={isVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <button
              onClick={toggleVisibility}
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            >
              {isVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          onClick={loginuser}
        >
          Login
        </button>
      </form>

      <p className="text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up here
        </a>
      </p>
    </div>
  </div>
</>

  );
}

export default Login;

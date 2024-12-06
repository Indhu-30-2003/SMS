import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/homebg.jpg')" }}
    >
      {/* Transparent Div for Title and Quote */}
      <div className="bg-gray-800 bg-opacity-50 text-white py-6 px-10 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Student Management System
        </h1>
        <p className="text-lg md:text-xl italic font-light">
          "Empowering students, one step at a time."
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col md:flex-row gap-4 mt-10 bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg">
        <button
          onClick={goToLogin}
          className= " text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105" style={{backgroundColor:"#D1392B"}}
        >
          Login
        </button>
        <button
          onClick={goToSignup}
          className=" text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105" style={{backgroundColor:"#D1392B"}}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default MainPage;

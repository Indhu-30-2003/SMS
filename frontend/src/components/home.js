import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const token = location.state?.token || localStorage.getItem("userToken");
  const uid = location.state?.uid || localStorage.getItem("uid"); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Store token and uid in localStorage for persistence
        localStorage.setItem("userToken", currentUser.accessToken);
        localStorage.setItem("uid", currentUser.uid);
      } else {
        setUser(null);
        navigate("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [navigate]);

  // Logout Functionality
  function logout() {
    signOut(auth)
      .then(() => {
        alert("Logged out Successfully");
        localStorage.removeItem("userToken");
        localStorage.removeItem("uid");
        navigate("/login");
      })
      .catch(() => {
        alert("Unable to log out. Please try again.");
      });
  }

  function handleUID() {
    navigate('/studentform', { state: { uid: uid } });
  }

  if (!user) {
    return null; // While loading or if user is not authenticated
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="shadow-md p-3 flex items-center justify-between sticky top-0 bg-gradient-to-r from-red-500 to-red-500 text-white z-50">
        <h1 className="text-3xl font-bold tracking-wide">
          Student Management System
        </h1>
        <button
          onClick={logout}
          className="px-6 py-2 bg-cyan-950 text-white font-semibold rounded-full shadow-lg hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-200 to-orange-300 p-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl w-full">
          {/* Add Students Card */}
          <div
            onClick={handleUID}
            className="bg-white text-red-800 text-center font-semibold p-6 rounded-lg shadow-lg cursor-pointer hover:bg-orange-50 hover:scale-105 transition duration-200"
          >
            <h2 className="text-lg md:text-xl flex items-center justify-center gap-2">
              Add Students
            </h2>
            <p className="mt-2 text-xs md:text-sm text-gray-600">
              Click to add new student records
            </p>
          </div>

          {/* List of Students Card */}
          <div
            onClick={() => navigate('/studentlist')}
            className="bg-white text-red-800 text-center font-semibold p-6 rounded-lg shadow-lg cursor-pointer hover:bg-orange-50 hover:scale-105 transition duration-200"
          >
            <h2 className="text-lg md:text-xl flex items-center justify-center gap-2">
              List of Students
            </h2>
            <p className="mt-2 text-xs md:text-sm text-gray-600">
              View the list of all registered students
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">
          &copy; 2024 Student Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

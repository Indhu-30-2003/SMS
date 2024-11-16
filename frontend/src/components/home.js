import { signOut } from "firebase/auth";
import auth from "../firebase";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  function logout() {
    signOut(auth)
      .then(() => {
        alert("Logged out Successfully");
        navigate("/login");
      })
      .catch(() => "Unable to Log out");
  }
  return (
    <>
  <nav className="shadow-md p-3 flex flex-wrap items-center justify-between">
    <h1 className="text-blue-600 text-2xl font-bold">
      Student Management System
    </h1>
    <button
      onClick={logout}
      className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 mt-2 md:mt-0"
    >
      Logout
    </button>
  </nav>

  <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-lg w-full">
      <div
        onClick={() => navigate('/studentform')}
        className="bg-blue-500 text-white text-center font-semibold p-6 rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition duration-200"
      >
        <h2 className="text-lg md:text-xl">Add Students</h2>
        <p className="mt-2 text-xs md:text-sm">Click to add new student records</p>
      </div>

      <div
        onClick={() => navigate('/studentlist')}
        className="bg-green-500 text-white text-center font-semibold p-6 rounded-lg shadow-lg cursor-pointer hover:bg-green-600 transition duration-200"
      >
        <h2 className="text-lg md:text-xl">List of Students</h2>
        <p className="mt-2 text-xs md:text-sm">View the list of all registered students</p>
      </div>
    </div>
  </div>
</>

  );
}

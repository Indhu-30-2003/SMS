import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Studentlist() {
  const [student, setStudent] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const navigate = useNavigate();

  // Fetching students
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetching students from backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudent(response.data);
      console.log(response.data)
    } catch (error) {
      console.log("Error in fetching data", error);
    }
  };

  // Deleting a student
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudent(student.filter(student => student._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Editing student details
  const editing = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
  };

  // Updating students
  const updating = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/${currentStudent._id}`, currentStudent);
      fetchStudents();
      setIsEditing(false);
      setCurrentStudent(null);
    } catch (error) {
      console.log("Error in updating", error);
    }
  };

  // Handle input changes for editing
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  // Handle back click
  function handleBackClick() {
    navigate("/home");
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
    <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Student List</h2>
  
    {student.length === 0 ? (
      <p className="text-center text-gray-500">No students have been added.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full mt-4 bg-white rounded shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Age</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Grade</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {student.map((student) => (
              <tr key={student._id} className="border-b">
                <td className="py-2 px-4 text-center">{student.name}</td>
                <td className="py-2 px-4 text-center">{student.age}</td>
                <td className="py-2 px-4 text-center">{student.contact}</td>
                <td className="py-2 px-4 text-center">{student.grade}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  <button
                    onClick={() => editing(student)}
                    className="bg-yellow-500 text-white px-3 py-1 m-2 rounded hover:bg-yellow-600 transition duration-150"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteStudent(student._id)}
                    className="bg-red-500 text-white px-3 py-1 m-2 rounded hover:bg-red-600 transition duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  
    <div className="flex justify-center mt-4">
      <button
        type="button"
        onClick={handleBackClick}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-150"
      >
        Back to Home
      </button>
    </div>
  
    {isEditing && (
      <div className="mt-6 p-4 bg-gray-200 rounded-lg shadow-lg max-w-lg mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">Edit Student</h3>
        <input
          type="text"
          name="name"
          value={currentStudent.name}
          onChange={handleInputs}
          placeholder="Name"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="age"
          value={currentStudent.age}
          onChange={handleInputs}
          placeholder="Age"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="contact"
          value={currentStudent.contact}
          onChange={handleInputs}
          placeholder="Address"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="grade"
          value={currentStudent.grade}
          onChange={handleInputs}
          placeholder="Grade"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={updating}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150"
        >
          Save Changes
        </button>
      </div>
    )}
  </div>
  
  );
}

export default Studentlist;

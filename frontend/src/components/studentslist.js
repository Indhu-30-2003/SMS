import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Studentlist() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    name: "",
    age: "",
    contact: "",
    grade: "",
  });
  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState({ name: "" });
  const [isSearching, setIsSearching] = useState(false); // New state for search status
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Items per page
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || localStorage.getItem("userToken");

  // Fetch students whenever currentPage or token changes
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchStudents(token, currentPage);
    }
  }, [token, currentPage, navigate]);

  // Fetch students from backend
  const fetchStudents = async (token, page) => {
    try {
      //Fetch Students (with Pagination)
      const response = await axios.get("http://localhost:5000/api/students", {
        
        //about the current page number (page) and how many records to fetch per page (limit).
        params: { page, limit },
        headers: {
          Authorization:` Bearer ${token}`,
        },
      });
      //Fetch All Students
      const allResponse = await axios.get("http://localhost:5000/api/students/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllStudents(allResponse.data.students || []);

      if (response.data) {
        setStudents(response.data.students || []);
        setFilteredStudents(response.data.students || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle input change for filtering
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters((prev) => ({ ...prev, [name]: value }));
};

// Search students based on name
const handleSearch = () => {
  setIsSearching(true); // Start searching

  const filtered = allStudents.filter((student) =>
    student.name.toLowerCase().includes(filters.name.toLowerCase())
  );

  setFilteredStudents(filtered);
  setFilters({ name: "" }); // Clear the filter field
};


  
   
  // Show all students
  const handleList = () => {
    setIsSearching(false); // Show all students
    setFilteredStudents(students);
  };

  // Delete student
  const deleteStudent = async (id) => {
    alert("Do you want to  delete this student data?")
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStudents(token, currentPage);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Start editing
  const startEditing = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
  };

  // Update student
  const updateStudent = async () => {
    alert("Do you want to update this student data?")
    if (validateForm()) {
      try {
        await axios.put
          (`http://localhost:5000/api/students/${currentStudent._id}`,
          currentStudent,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsEditing(false);
        fetchStudents(token, currentPage);
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    const ageRegex = /^(?:[3-9]|[1-9][0-9]|100)$/;
    const contactRegex = /^[a-zA-Z0-9\s,.'-]{5,100}$/;
    const gradeRegex = /^[A-Za-z]{1,5}$/;

    let formErrors = {};
    let isValid = true;

    if (!nameRegex.test(currentStudent.name)) {
      formErrors.name =
        "Name must be 3-50 characters long and contain only letters and spaces.";
      isValid = false;
    }

    if (!ageRegex.test(currentStudent.age)) {
      formErrors.age = "Age must be a number between 3 and 100.";
      isValid = false;
    }

    if (!contactRegex.test(currentStudent.contact)) {
      formErrors.contact =
        "Address must be 5-100 characters long and include valid symbols.";
      isValid = false;
    }

    if (!gradeRegex.test(currentStudent.grade)) {
      formErrors.grade = "Grade must be letters between A and Z.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Back to Home
  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-700">Student List</h2>

      {/* Filter and Search Inputs */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border p-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-cyan-950 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={handleList}
          className="bg-red-800 text-white px-4 py-2 rounded"
        >
          List
        </button>
      </div>
    

      {filteredStudents.length === 0 ? (
        <p className="text-center text-gray-500">No students found.</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Age</th>
              <th className="py-2 px-4">Contact</th>
              <th className="py-2 px-4">Grade</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td className="py-2 px-4 text-center" >{student.name}</td>
                <td className="py-2 px-4 text-center">{student.age}</td>
                <td className="py-2 px-4 text-center">{student.contact}</td>
                <td className="py-2 px-4 text-center">{student.grade}</td>
                <td className="py-2 px-4 space-x-2 text-center">
                  <button
                    onClick={() => startEditing(student)}
                    className="bg-cyan-950 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteStudent(student._id)}
                    className="bg-red-800 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={handleBackClick}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>

      {isEditing && (
        <div className="mt-6 p-4 bg-gray-200 rounded">
          <h3 className="text-lg font-semibold mb-4">Edit Student</h3>
          <div className="mb-4">
            <label className="block">Name</label>
            <input
              type="text"
              name="name"
              value={currentStudent.name}
              onChange={handleInputChange}
              className="w-full px-2 py-1 border"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block font-medium">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={currentStudent.age}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="contact" className="block font-medium">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={currentStudent.contact}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="grade" className="block font-medium">
              Grade
            </label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={currentStudent.grade}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded"
            />
            {errors.grade && (
              <p className="text-red-500 text-xs mt-1">{errors.grade}</p>
            )}
          </div>
          <button
            onClick={updateStudent}
            className="bg-cyan-950 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}



export default Studentlist;
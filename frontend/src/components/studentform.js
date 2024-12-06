import React, { useState , useEffect } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import axios from "axios";
import { getAuth } from 'firebase/auth';

function StudentForm() {
  const [student, setstudent] = useState({
    name: "",
    age: "",
    contact: "",
    grade: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    contact: "",
    grade: "",
  })

  const [uid, setUid] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || localStorage.getItem("userToken");
  console.log('Token:', token);

   // Get the UID passed from the Home page or login
   useEffect(() => {
    const storedUid = localStorage.getItem("uid");

    if (location.state?.uid) {
        setUid(location.state.uid);
        localStorage.setItem("uid", location.state.uid); // Save UID to persistent storage
    } else if (storedUid) {
        setUid(storedUid); // Use UID from storage
    } else {
        alert("UID is missing, please login first.");
        navigate("/login");
    }
}, [location.state, navigate]);

  //stores inputs from the user and error
  const handleChange = (e) => {
    setstudent({ ...student, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" })
  };

  //validate form for input fields
  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    const ageRegex = /^(?:[3-9]|[1-9][0-9]|100)$/;
    const contactRegex = /^[a-zA-Z0-9\s,.'-]{5,100}$/;
    const gradeRegex = /^[A-Za-z]{1,5}$/;
    
   

    let formErrors = {};
    let isValid = true;

    if (!nameRegex.test(student.name)) {
      formErrors.name = "Name must be 3-50 characters long and contain only letters and spaces.";
      isValid = false;
    }

    if (!ageRegex.test(student.age)) {
      formErrors.age = "Age must be a number between 3 and 100.";
      isValid = false;
    }

    if (!contactRegex.test(student.contact)) {
      formErrors.contact = "Address must be 5-100 characters long and include valid symbols.";
      isValid = false;
    }

    if (!gradeRegex.test(student.grade)) {
      formErrors.grade = "Grade must be a  letter between A and Z.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     
    // Stop submission if validation fails
    if (!validateForm()) {
      return; 
    }
    console.log("Submitting student data:", student);
    const studentData = { ...student, uid }; 
    console.log(studentData)
    console.log(uid)// Add UID to student data

   

    try {
      // Get Firebase ID token
      const token = await getAuth().currentUser.getIdToken(true); 
      //sends an student data through api and saves the server side response
      const response = await axios.post(
        "http://localhost:5000/api/students",
        studentData,
        {
          headers: {
            // Include the token in the Authorization header
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      console.log('Student added successfully:', response.data);

      if (response.status === 201) {
        alert("Database saved Succesfully");
        setstudent({ name: "", age: "", contact: "", grade: "" });
        setErrors({});
       
       
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Please log in again.");
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        console.error("Error adding student:", error);
      }
    }
  };

  function handleBackClick() {
    navigate("/home");
  }
  function handleListClick() {
    navigate("/studentlist");
  }

   // Check if form is valid
   const isFormValid = student.name && student.age && student.contact && student.grade && !Object.values(errors).some((error) => error);


   return (
    <div className="flex items-center justify-center min-h-screen "   >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 bg-white  bg-opacity-10 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-extrabold text-center text-red-700 font-nunito">
          Add Student
        </h2>
  
        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-red-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500" : "focus:ring-cyan-950"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
  
        {/* Age Field */}
        <div className="mb-4">
          <label
            htmlFor="age"
            className="block mb-2 text-sm font-medium text-red-700"
          >
            Age
          </label>
          <input
            id="age"
            type="number"
            name="age"
            value={student.age}
            onChange={handleChange}
            placeholder="Enter your age"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
              errors.age ? "border-red-500" : "focus:ring-cyan-950"
            }`}
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>
  
        {/* Address Field */}
        <div className="mb-4">
          <label
            htmlFor="contact"
            className="block mb-2 text-sm font-medium text-red-700"
          >
            Address
          </label>
          <input
            id="contact"
            type="text"
            name="contact"
            value={student.contact}
            onChange={handleChange}
            placeholder="Enter your address"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
              errors.contact ? "border-red-500" : "focus:ring-cyan-950"
            }`}
          />
          {errors.contact && (
            <p className="text-red-500 text-sm">{errors.contact}</p>
          )}
        </div>
  
        {/* Grade Field */}
        <div className="mb-4">
          <label
            htmlFor="grade"
            className="block mb-2 text-sm font-medium text-red-700"
          >
            Grade
          </label>
          <input
            id="grade"
            type="text"
            name="grade"
            value={student.grade}
            onChange={handleChange}
            placeholder="Enter your grade"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
              errors.grade ? "border-red-500" : "focus:ring-cyan-950"
            }`}
          />
          {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
        </div>
  
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full sm:w-auto px-4 py-2 text-white rounded transition duration-150 ${
              isFormValid
                ? "bg-cyan-950"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save Student
          </button>
  
          <button
            type="button"
            onClick={handleBackClick}
            className="w-full sm:w-auto px-4 py-2 text-white bg-red-800 rounded hover:bg-red-800 transition duration-150"
          >
            Back to Home
          </button>
          
  
          <button
            type="button"
            onClick={handleListClick}
            className="w-full sm:w-auto px-4 py-2 text-white bg-red-800 rounded hover:bg-red-800 transition duration-150"
          >
            List of Students
          </button>
        </div>
      </form>
    </div>
  );
  
}

export default StudentForm;
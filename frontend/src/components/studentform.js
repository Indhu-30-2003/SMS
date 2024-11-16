import React, { useState } from 'react';
import {useNavigate} from "react-router-dom"
import axios from "axios"

function StudentForm({ fetchStudents }) {
   const [student,setstudent]=useState({ name: '', age: '', contact: '', grade: '' })
   const [error,seterror]=useState("")
   const navigate=useNavigate()

   //stores inputs from the user 
   const handleChange=(e)=>{
     setstudent({...student,[e.target.name]:e.target.value})
   }

   const handleSubmit= async (e)=>{
       e.preventDefault()

       //validates input field
       if (!student.name || !student.age || !student.contact || !student.grade) {
        seterror('All fields are required.');
        return;
      }
      console.log('Submitting student data:', student);
      try {

        //sends an student data through api and saves the server side response 
        const response= await axios.post('http://localhost:5000/api/students', student);
        console.log(response)

        if(response.status===201){
          alert("Database saved Succesfully")
          setstudent({ name: '', age: '', contact: '', grade: '' });
          seterror('');
          fetchStudents();
          navigate("/studentlist");
        }
       
      } catch (error) {
        console.error('Error adding student:', error);
      }
   }
   
   function handleBackClick(){
     navigate("/home")
   }
   function handleListClick(){
    navigate("/studentlist")
   }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 px-4">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg space-y-4 bg-gray-100 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold text-center text-gray-800">Add Student</h2>
     
     {/*if error occurs it will render right side */ }
      {error && <p className="text-red-500 text-center">{error}</p>}
  
      <input
        type="text"
        name="name"
        value={student.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        name="age"
        value={student.age}
        onChange={handleChange}
        placeholder="Age"
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="contact"
        value={student.contact}
        onChange={handleChange}
        placeholder="Address"
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="grade"
        value={student.grade}
        onChange={handleChange}
        placeholder="Grade"
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
  
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-150"
        >
          Save Student
        </button>
  
        <button
          type="button"
          onClick={handleBackClick}
          className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-150"
        >
          Back to Home
        </button>
  
        <button
          type="button"
          onClick={handleListClick}
          className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-150"
        >
          List of Students
        </button>
      </div>
    </form>
  </div>
  
    );


}

export default StudentForm;

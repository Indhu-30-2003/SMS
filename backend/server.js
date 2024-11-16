const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

app.use(express.json());

//connecting mongoose 

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongodb connected")
}).catch((error)=>{
    console.log(error)
    console.log("mongodb connection failed")
})

//creating schema and models

const studentSchema= new mongoose.Schema({
    name:{type:String,require:true},
    age:{type:Number,require:true},
    grade:{type:String,require:true},
    contact:{type:String,require:true}
})

const Student= mongoose.model("Student",studentSchema)

//adding a student

app.post("/api/students" ,async (req,res)=>{
    try{
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(newStudent);
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
})

//to get all students

app.get("/api/students",async (req,res)=>{
    try{
        const students= await Student.find()
        res.status(200).json(students)
    }
    catch(error){
        res.status(500).json({error:error.message}) 
    }
})

//update a student

app.put('/api/students/:id', async (req, res) => {
    try {
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedStudent) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//delete the students

app.delete("/api/students/:id",async (req,res)=>{
    try{
        const deleteStudent= await  Student.findByIdAndDelete(req.params.id)
        if (!deleteStudent) {
            return res.status(404).json({ error: 'Student not found' });
          }
          res.status(200).json({ message: 'Student deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }
)

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
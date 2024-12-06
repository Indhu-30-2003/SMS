 import Login from "./components/login"
 import Signup from "./components/signup"
 import Home from "./components/home"
 import StudentForm from "./components/studentform"
 import Studentlist from "./components/studentslist"
 import {BrowserRouter,Routes,Route,} from "react-router-dom"
 import MainPage from "./components/mainpage"

 export default function App(){
 return(<>

 <BrowserRouter>
 
  <Routes>
  <Route path="/home" element={<Home/>}></Route>
   <Route path="/" element={<MainPage/>}></Route>
    <Route path="/login" element={<Login/>}></Route>
    <Route path="/signup" element={<Signup/>}></Route>
    <Route path="/studentform" element={<StudentForm/>}></Route>
    <Route path="/studentlist" element={<Studentlist/>}></Route>
  </Routes>
 </BrowserRouter>
  
 </>)
}
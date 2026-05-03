import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from "../Pages/Registration.jsx"
import Login from "../Pages/Login.jsx"
import Home from "../Pages/Home.jsx"
import Main from "../Pages/Main.jsx"
import Exam from "../Pages/Exam.jsx"
import CertificateDisplay from '../Components/CertificateDisplay.jsx';
function Navigation(){
    return(
    <div>
      <Router>
            <Routes>
                <Route path="/" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Main" element={<Main />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/certificate/:id" element={<CertificateDisplay/>}/>
            </Routes>
        </Router>
    </div>
    );
}
export default Navigation;
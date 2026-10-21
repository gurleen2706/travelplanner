import React, { useState , useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./home.jsx";
import Itinerary from "./itinerary.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import ContinentPage from "./continentpage.jsx";
import CountryPage from "./countrypage.jsx";
import Navbar from "./navbar.jsx";


 function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
 
  useEffect(() => {
    if (!localStorage.getItem("userName")) {
      localStorage.setItem("userName", "Gurleen");
    }
  }, []);

  // ONLY ONE RETURN STATEMENT
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/itinerary" 
          element={token ? <Itinerary /> : <Navigate to="/login" />} 
        />
        
        <Route path="/continent/:continent" element={<ContinentPage />} />
        <Route path="/country/:country" element={<CountryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
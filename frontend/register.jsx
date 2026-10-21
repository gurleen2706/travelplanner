import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./home.jsx";
import Itinerary from "./itinerary.jsx";
import Login from "./Login.jsx"; // Import the component

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Pass setToken to Login so it can update the state */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route 
          path="/itinerary" 
          element={token ? <Itinerary /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
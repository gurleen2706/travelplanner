import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Trips from "./Trips";
import "./home.css";
import ContinentPage from "./continentpage";
import CountryPage from "./countrypage";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/continent/:continent" element={<ContinentPage />} />
      <Route path="/country/:country" element={<CountryPage />} />
    </Routes>
  );
}

function Home() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState(null);
  const [bgImage, setBgImage] = useState("");

  const handleGenerate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, startDate, endDate }),
      });

      const data = await res.json();
      setResult(data);
      console.log("Trip created:", data);
    } catch (err) {
      console.error("Error creating trip:", err);
    }
  };

  // Base background style matching the premium layout dark aesthetic
  const pageWrapperStyle = {
    position: "relative",
    minHeight: "10vh",
    padding: "40px 20px",
    color: "#fff",
    textAlign: "center",
    transition: "background 0.5s ease-in-out, background-color 0.5s ease-in-out",
    backgroundColor: "rgba(0, 0, 0, 0.55)", /* Premium midnight base instead of harsh flat black */
    
    // Smoothly layer the darkening veil on top of the hovered continent image
    backgroundImage: bgImage 
      ? `linear-gradient(rgba(13, 15, 23, 0.75), rgba(13, 15, 23, 0.85)), url(${bgImage})` 
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed"
  };

  return (
    <div style={pageWrapperStyle}>
      {/* NOTE: The old .backdrop div has been removed! 
        The background properties are now controlled cleanly by the parent wrapper.
      */}

      <div className="home-container">
        <h1>TRAVEL PLANNER</h1>
        <p>Enter your destination and generate an itinerary:</p>

        {/* inputs and button here */}

        {result && (
          <div className="trip-result">
            <h2>Trip Created</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <div className="continent-row">
          {[
            { name: "Asia", img: "/images/asia.jpg" },
            { name: "Europe", img: "/images/eur.jpg" },
            { name: "Africa", img: "/images/africa.jpg" },
            { name: "North America", img: "/images/na.jpg" },
            { name: "South America", img: "/images/sa.jpg" },
            { name: "Australia", img: "/images/aus.jpg" },
            { name: "Antarctica", img: "/images/ant.jpg" },
          ].map((c) => (
            <Link
              key={c.name}
              to={`/continent/${c.name.replace(/\s+/g, "").toLowerCase()}`}
              className="continent-card"
              style={{ backgroundImage: `url(${c.img})` }}
              onMouseEnter={() => setBgImage(c.img)}   // Hover smoothly fades the background image in
              onMouseLeave={() => setBgImage("")}      // Fades back to midnight velvet tone on leave
              onClick={() => setBgImage(c.img)}        
            >
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

function ContinentPage() {
  const { continent } = useParams();

  // State to track which country card is currently hovered
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const continentImages = {
    asia: "/images/asia.jpg",
    europe: "/images/eur.jpg",
    africa: "/images/africa.jpg",
    northamerica: "/images/na.jpg",
    southamerica: "/images/sa.jpg",
    australia: "/images/aus.jpg",
    antarctica: "/images/ant.jpg"
  };

  const currentBg = continent && continentImages[continent.toLowerCase()] ? continentImages[continent.toLowerCase()] : "";

  const countries = {
    asia: [
      "India", "China", "Japan", "South Korea", "Thailand", "Vietnam",
      "Indonesia", "Malaysia", "Singapore", "Nepal", "Sri Lanka",
      "Bangladesh", "Pakistan", "Philippines", "Myanmar", "Mongolia",
      "Bhutan", "Maldives", "Cambodia", "Laos", "Afghanistan",
      "Uzbekistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan",
      "Turkmenistan", "Iran", "Iraq", "Saudi Arabia", "United Arab Emirates",
      "Qatar", "Oman", "Kuwait", "Jordan", "Lebanon", "Israel", "Turkey"
    ],
    europe: ["France", "Germany", "Italy", "Spain", "United Kingdom", "Switzerland"],
    africa: ["Egypt", "South Africa", "Kenya", "Morocco", "Nigeria"],
    northamerica : ["USA", "Canada", "Mexico"],
    southamerica: ["Brazil", "Argentina", "Chile", "Peru"],
    australia: ["Australia", "New Zealand"],
    antarctica: ["Research Stations"]
    
  };

  const list = continent ? countries[continent.toLowerCase()] : null;

  // Base Layout Container Styles
  const pageStyle = {
    padding: "60px 20px",
    minHeight: "100vh",
    color: "#ebdc75",
    textAlign: "center",
    backgroundColor: "#000",
    backgroundImage: currentBg ? `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.85)), url(${currentBg})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed"
  };

  const titleStyle = {
    fontSize: "4rem",
    fontWeight: "800",
    fontFamily: "system-ui, -apple-system, sans-serif",
    letterSpacing: "4px",
    marginBottom: "50px",
    color: "#ebdc75",
    textShadow: "0 0 20px rgba(237, 231, 99, 0.55)"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "16px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    gridAutoFlow: "dense"
  };

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>
        {continent ? continent.toUpperCase() : "CONTINENT"}
      </h2>

      {list ? (
        <div style={gridStyle}>
          {list.map((country) => {
            const isWide = country.length > 9 || country.includes(" ");
            const isHovered = hoveredCountry === country;

            return (
              <Link
                key={country}
                to={`/country/${country.toLowerCase()}`}
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isHovered ? "#ebdc75" : "#ffffff",
                  backgroundColor: isHovered ? "rgba(28, 28, 28, 0.9)" : "rgba(30, 30, 30, 0.75)",
                  transform: isHovered ? "scale(1.03)" : "scale(1)",
                  borderColor: isHovered ? "#ebdc75" : "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  padding: "25px 20px",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  borderRadius: "12px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  gridColumn: isWide ? "span 2" : "span 1",
                  transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease"
                }}
              >
                {country}
              </Link>
            );
          })}
        </div>
      ) : (
        <p>No countries found for {continent}.</p>
      )}
    </div>
  );
}

export default ContinentPage;
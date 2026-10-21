import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { globalCountriesDB } from "./data/countries"; 
import jsPDF from "jspdf";
import { Country, State } from "country-state-city";

function CountryPage() {
  const { country } = useParams();
  const countryKey = country?.toLowerCase().replace(" ", "-");
  
  const [hoveredCard, setHoveredCard] = useState(null);

  // 💥 FIX: Changed default state from a string "" to null/array so it tracks structural data layers cleanly
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  // 1. Form State Management
  const [formData, setFormData] = useState({
    destination: "",
    stateOfStay: "",
    startDate: "",
    endDate: "",
  });
  const [selectedCosts, setSelectedCosts] = useState({});
  const [selectedActivities, setSelectedActivities] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const selectedCountry = Country.getAllCountries().find(
  (c) =>
    c.name.toLowerCase() === formData.destination.toLowerCase()
);

const states = selectedCountry
  ? State.getStatesOfCountry(selectedCountry.isoCode)
  : [];
  
  useEffect(() => {
    if (country) {
      // Capitalize first letter neatly for the input box value
      const formatted = country.charAt(0).toUpperCase() + country.slice(1);
      setFormData((prev) => ({ ...prev, destination: formatted }));
    }
  }, [country]);

  // Capitalize country name for layout display
  const countryName = country ? country.toUpperCase() : "DESTINATION";

  const countryData = globalCountriesDB[countryKey] || {
    bgImage: "/images/countries/default.jpg",
    currency: "🔁 Local Currency",
    season: "📅 Year-Round",
    language: "🗣️ Local Dialect",
    timezone: "⏰ GMT Local",
    description: `Welcome to your personalized travel guide for ${countryName}. Explore curated routes, discover hidden gems, and plan an unforgettable itinerary.`,
  };
  const currencyCode = countryData.currency
    ? countryData.currency.split(" ")[1]
    : "LOCAL";
    const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  SGD: "S$",
  CHF: "CHF",
};

const currencySymbol =
  currencySymbols[currencyCode] || currencyCode;

const getActivityCost = (activity) => {

  const countryMultiplier = {
    India: 1,
    Italy: 0.018,
    France: 0.018,
    Germany: 0.018,
    Spain: 0.018,
    Portugal: 0.018,
    Netherlands: 0.018,

    USA: 0.021,
    Canada: 0.027,

    Japan: 2.3,
    China: 0.085,
    SouthKorea: 18,

    Australia: 0.028,
    NewZealand: 0.031,

    UAE: 0.044,
    Singapore: 0.016,
    Thailand: 0.42,
    Indonesia: 190,
    Malaysia: 0.055,
  };

  const multiplier =
    countryMultiplier[formData.destination] || 1;

  let cost = 0;

  const text = activity.toLowerCase();

  if (
    text.includes("beach") ||
    text.includes("park") ||
    text.includes("garden") ||
    text.includes("walk")
  ) {
    cost = 0;
  }

  else if (
    text.includes("fort") ||
    text.includes("museum") ||
    text.includes("temple") ||
    text.includes("church")
  ) {
    cost = Math.floor(Math.random() * 150 + 50);
  }

  else if (
    text.includes("shopping") ||
    text.includes("market") ||
    text.includes("mall")
  ) {
    cost = Math.floor(Math.random() * 1200 + 300);
  }

  else if (
    text.includes("restaurant") ||
    text.includes("cafe") ||
    text.includes("food") ||
    text.includes("dinner") ||
    text.includes("lunch")
  ) {
    cost = Math.floor(Math.random() * 400 + 200);
  }

  else if (
    text.includes("cruise") ||
    text.includes("rafting") ||
    text.includes("trek") ||
    text.includes("safari")
  ) {
    cost = Math.floor(Math.random() * 1200 + 500);
  }

  else {
    cost = Math.floor(Math.random() * 300 + 100);
  }

  return Math.round(cost * multiplier);
};

const handleSelection = (day, segment, activity) => {
  const cost = getActivityCost(activity);

  setSelectedCosts((prev) => ({
    ...prev,
    [`${day}-${segment}`]: cost,
  }));

  setSelectedActivities((prev) => ({
    ...prev,
    [`${day}-${segment}`]: activity,
  }));
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
   
useEffect(() => {
  if (!generatedItinerary?.days_data) return;

  const activities = {};
  const costs = {};

  generatedItinerary.days_data.forEach((day) => {
    ["morning", "afternoon", "evening"].forEach((segment) => {
      const firstOption = day.options[segment][0];

      activities[`${day.dayNumber}-${segment}`] = firstOption;
      costs[`${day.dayNumber}-${segment}`] = getActivityCost(firstOption);
    });
  });

  setSelectedActivities(activities);
  setSelectedCosts(costs);

  console.log("Default selections loaded");
}, [generatedItinerary]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Safely verify if stateOfStay or places has a value
      const locationPlace = formData.stateOfStay || formData.places || "";

      const response = await axios.post("http://localhost:5000/api/trips", {
        userId: localStorage.getItem("userName"),
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        places: [locationPlace],
      });

      if (response && response.status === 201) {
        setMessage("🎉 Trip setup successfully ");
        setGeneratedItinerary(response.data.itinerary);
        setFormData((prev) => ({
          ...prev,
          stateOfStay: "",
          startDate: "",
          endDate: "",
        }));
      }
    } catch (err) {
      console.error("Submission failed:", err);

      // Check if the backend responded with a specific error message
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`❌ Backend Pipeline Error: ${err.response.data.error}`);
      } else {
        setMessage(
          "❌ Planning pipeline failed. Please ensure your Node (port 5000) and Python (port 8000) servers are both running.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
  const doc = new jsPDF();

  let y = 20;
  let grandTotal = 0;

doc.setFillColor(56, 189, 248);
doc.rect(0, 0, 210, 35, "F");

doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.setFontSize(24);
doc.text("TRAVEL PLANNER", 20, 18);

doc.setFontSize(12);
doc.text("Your Personalized Travel Companion", 20, 27);

doc.setTextColor(0, 0, 0);

y = 50;


doc.setDrawColor(0,123,255);

doc.roundedRect(15,y,180,30,3,3);

doc.setFontSize(12);

doc.text(`Destination : ${formData.destination}`,20,y+10);

doc.text(`Trip Days : ${generatedItinerary.days_data.length}`,20,y+20);

doc.text(
`Generated : ${new Date().toLocaleDateString()}`,
110,
y+10
);

y += 40;

  generatedItinerary.days_data.forEach((day) => {

    // Add new page if needed
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(15);
doc.setFillColor(245,245,245);

doc.roundedRect(
15,
y-6,
180,
55,
4,
4,
"F"
);

doc.setDrawColor(56,189,248);

doc.roundedRect(
15,
y-6,
180,
55,
4,
4
);

doc.setFontSize(15);

doc.setFont(
"helvetica",
"bold"
);

doc.setFillColor(245,245,245);

doc.roundedRect(15,y-5,180,60,3,3,"F");

doc.setDrawColor(56,189,248);

doc.roundedRect(15,y-5,180,60,3,3);

doc.setFontSize(16);
doc.setFont("helvetica","bold");

    y += 10;

    const morning =
      selectedActivities[`${day.dayNumber}-morning`];

    const afternoon =
      selectedActivities[`${day.dayNumber}-afternoon`];

    const evening =
      selectedActivities[`${day.dayNumber}-evening`];

    const morningCost =
      selectedCosts[`${day.dayNumber}-morning`] || 0;

    const afternoonCost =
      selectedCosts[`${day.dayNumber}-afternoon`] || 0;

    const eveningCost =
      selectedCosts[`${day.dayNumber}-evening`] || 0;

    const total =
      morningCost +
      afternoonCost +
      eveningCost;

    grandTotal += total;

    doc.setFontSize(11);

    doc.text(` Morning : : ${morning}`, 25, y);
    y += 7;

    doc.text(` Afternoon : ${afternoon}`, 25, y);
    y += 7;

    doc.text(` Evening : ${evening}`, 25, y);
    y += 10;

    doc.text(`Morning Budget : ${currencySymbol}${morningCost}`,30,y);
    y += 6;

    doc.text(`Afternoon Budget : ${currencySymbol}${afternoonCost}`,30,y);
    y += 6;

    doc.text(`Evening Budget : ${currencySymbol}${eveningCost}`,30,y);
    y += 6;

    doc.text(`Day Total : ${currencySymbol}${total}`,30,y);
    y += 15;
  });

  doc.setFontSize(16);
doc.setFillColor(56,189,248);

doc.rect(
0,
275,
210,
22,
"F"
);

doc.setTextColor(255);

doc.setFontSize(16);

doc.setFillColor(56,189,248);

doc.rect(0,280,210,17,"F");

doc.setTextColor(255);

doc.setFontSize(16);

doc.text(
`Grand Trip Budget : ${currencySymbol}${grandTotal}`,
20,
291
);

doc.setTextColor(120);

doc.setFontSize(10);

doc.setFillColor(30,41,59);
doc.rect(0,0,210,35,"F");

doc.setTextColor(255,255,255);
doc.setFontSize(22);
doc.setFont("helvetica","bold");
doc.text("TRAVEL PLANNER",20,18);

doc.setFontSize(11);
doc.text("Personalized Travel Itinerary",20,28);

doc.setTextColor(0,0,0);

y = 45;

doc.text(
"Have a Safe Journey ✈",
20,
300
);

  doc.save("Travel-Itinerary.pdf");
};

  // Core Structural Layout Styles
  const splitPageStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0d0f17",
    color: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const leftPanelStyle = {
  // Layout Logic
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  
  // Positioning & Size
  width: "40%",
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  padding: "60px 40px",
  boxSizing: "border-box", // Essential for border calculation

  // Border (Added here)
  borderRight: "1px solid rgba(255, 255, 255, 0.2)", 

  // Visuals
  backgroundImage: `linear-gradient(to right, rgba(13,15,23,0.2), rgba(13,15,23,0.9)), url('${countryData.bgImage}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  
  // Ensure the panel stays on top so the border isn't covered by other elements
  zIndex: 1, 
};

  const rightPanelStyle = {
    width: "60%",
    marginLeft: "40%",
    padding: "60px 40px",
    boxSizing: "border-box",
  };
  
  const descriptionContainerStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.7",
  color: "#b4b6c4",
  marginBottom: "40px",
  minHeight: "100px", // Forces the container to take up space
};
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "30px",
    marginBottom: "50px",
  };

  const getGlassCardStyle = (id) => ({
    backgroundColor:
      hoveredCard === id
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border:
      hoveredCard === id
        ? "1px solid #38bdf8"
        : "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "left",
    transform: hoveredCard === id ? "translateY(-4px)" : "translateY(0)",
    transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
    cursor: "default",
  });

  const formStyles = {
    formGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "20px",
    },
    label: {
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#94a3b8",
      marginBottom: "8px",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "14px",
      backgroundColor: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "10px",
      color: "#ffffff",
      fontSize: "100%",
      outline: "none",
      transition: "all 0.2s ease",
    },
    dateRow: {
      display: "flex",
      gap: "20px",
    },
    submitBtn: {
      padding: "14px",
      backgroundColor: "#38bdf8",
      color: "#0d0f17",
      fontSize: "1rem",
      fontWeight: "700",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      marginTop: "10px",
      transition: "all 0.2s ease-in-out",
    },
  };

  return (
    <div style={splitPageStyle}>
      {/* LEFT FIXED PANEL: Cinematic Hero Picture */}
      <div style={leftPanelStyle}>
        <div style={{ marginBottom: "auto" }}>
          <Link
            to="/"
            style={{
              color: "#e1e8eb",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              letterSpacing: "1px",
            }}
          >
            ← BACK TO EXPLORE
          </Link>
        </div>
        <div>
          <h1
            style={{
              color: "#e1e8eb",
              fontSize: "clamp(2rem, 5vw, 4rem)", // Shrinks text if it gets too long
              fontWeight: "900",
              margin: "0",
              letterSpacing: "1px",
              lineHeight: "0.9", // Pulls the lines together so they don't overlap
              textShadow: "0 4px 12px rgba(0,0,0,0.5)",
              wordBreak: "break-word", // Forces long words to wrap properly
              textAlign: "left",
            }}
          >
            {countryName}
          </h1>
        </div>
      </div>
      {/* RIGHT SCROLL PANEL: Interactive Dashboard Metrics & Forms */}
      <div style={rightPanelStyle}>
        <div style={{ maxWidth: "700px" }}>
          <h3
            style={{
              color: "#38bdf8",
              letterSpacing: "2px",
              fontSize: "0.9rem",
              margin: "0 0 10px 0",
            }}
            
          >
            OVERVIEW
          </h3>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.7",
              color: "#b4b6c4",
              marginBottom: "40px",
            }}
          >
            {countryData.description}
          </p>

          <h3
            style={{
              color: "#38bdf8",
              letterSpacing: "2px",
              fontSize: "0.9rem",
              margin: "0",
            }}
          >
            QUICK ESSENTIALS
          </h3>

          {/* Glassmorphic Widget Grid */}
          <div style={gridStyle}>
            <div
              style={getGlassCardStyle("curr")}
              onMouseEnter={() => setHoveredCard("curr")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#a1a1aa",
                  fontSize: "0.85rem",
                }}
              >
                CURRENCY
              </h4>
              <div style={{ fontSize: "1.15rem", fontWeight: "700" }}>
                {countryData.currency}
              </div>
            </div>

            <div
              style={getGlassCardStyle("season")}
              onMouseEnter={() => setHoveredCard("season")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#a1a1aa",
                  fontSize: "0.85rem",
                }}
              >
                BEST TIME
              </h4>
              <div style={{ fontSize: "1.15rem", fontWeight: "700" }}>
                {countryData.season}
              </div>
            </div>

            <div
              style={getGlassCardStyle("lang")}
              onMouseEnter={() => setHoveredCard("lang")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#a1a1aa",
                  fontSize: "0.85rem",
                }}
              >
                LANGUAGE
              </h4>
              <div style={{ fontSize: "1.15rem", fontWeight: "700" }}>
                {countryData.language}
              </div>
            </div>

            <div
              style={getGlassCardStyle("zone")}
              onMouseEnter={() => setHoveredCard("zone")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#a1a1aa",
                  fontSize: "0.85rem",
                }}
              >
                TIMEZONE
              </h4>
              <div style={{ fontSize: "1.15rem", fontWeight: "700" }}>
                {countryData.timezone}
              </div>
            </div>
          </div>
        </div>
        {/* INTEGRATED APPLICATION BOXES / FORM PLANNER */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "40px",
            marginBottom: "40px",
          }}
        >
          <h3
            style={{
              color: "#38bdf8",
              letterSpacing: "2px",
              fontSize: "0.9rem",
              marginBottom: "25px",
            }}
          >
            PLAN YOUR ITINERARY
          </h3>

          <form
            onSubmit={handleFormSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            
            {/* Destination Input Box */}
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>DESTINATION COUNTRY</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g., Japan, India"
                required
                style={formStyles.input}
              />
            </div>

            {/* State/Region of Stay Input Box */}
            <div style={formStyles.formGroup}>
              <label style={formStyles.label}>STATE / REGION OF STAY</label>
              <input
  type="text"
  name="stateOfStay"
  list="stateList"
  value={formData.stateOfStay}
  onChange={handleInputChange}
  placeholder="Select a state or province"
  required
  style={formStyles.input}
  onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
  onBlur={(e) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.08)")
  }
/>

<datalist id="stateList">
  {states.map((state) => (
    <option
      key={state.isoCode}
      value={state.name}
    />
  ))}
</datalist>
            </div>

            {/* Calendar Row Matrix */}
            <div style={formStyles.dateRow}>
              <div style={{ ...formStyles.formGroup, flex: 1 }}>
                <label style={formStyles.label}>START DATE</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  style={formStyles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255, 255, 255, 0.08)")
                  }
                />
              </div>
              <div style={{ ...formStyles.formGroup, flex: 1 }}>
                <label style={formStyles.label}>END DATE</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  style={formStyles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#38bdf8")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255, 255, 255, 0.08)")
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={formStyles.submitBtn}
            >
              {loading
                ? "GENERATING TRIP SCHEDULING..."
                : "GENERATE EXPLORER PLAN"}
            </button>
          </form>
{
generatedItinerary &&
generatedItinerary.days_data &&
Array.isArray(generatedItinerary.days_data) ? (
 generatedItinerary.days_data.map((day) => (
    <div key={day.dayNumber} style={{ marginBottom: "40px" }}>
      {/* Day Header */}
      <h3 style={{ color: "#38bdf8", borderBottom: "1px solid #38bdf8", paddingBottom: "10px" }}>
        {day.title}
      </h3>

      {/* Helper function to generate sub-boxes */}
      {[
        { label: "🌅 MORNING", key: "morning" },
        { label: "🏛️ AFTERNOON", key: "afternoon" },
        { label: "🏮 EVENING", key: "evening" }
      ].map((segment) => (
        <div 
          key={segment.key} 
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "15px"
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#a1a1aa", fontWeight: "bold", letterSpacing: "1px" }}>
            {segment.label} SELECTION
          </span>
          {day.options[segment.key].map((opt, idx) => (
            <label key={idx} style={{ display: "flex", gap: "12px", marginTop: "10px", cursor: "pointer" }}>
              <input
  type="radio"
  name={`day-${day.dayNumber}-${segment.key}`}
  defaultChecked={idx === 0}
  onChange={() =>
    handleSelection(
      day.dayNumber,
      segment.key,
      opt
    )
  }
/>
              <span>{opt}</span>
            </label>
          ))}
        </div>
      ))}
      <div
  style={{
    marginTop: "20px",
    background: "rgba(56,189,248,0.08)",
    border: "1px solid rgba(56,189,248,0.25)",
    borderRadius: "12px",
    padding: "15px",
  }}
>
  <h4 style={{ color: "#38bdf8" }}>
    💰 Estimated Budget
  </h4>

  <p>
    🌅 Morning :
    {currencySymbol}{selectedCosts[`${day.dayNumber}-morning`] || 0}
  </p>

  <p>
    🏛 Afternoon :
    {currencySymbol}{selectedCosts[`${day.dayNumber}-afternoon`] || 0}
  </p>

  <p>
    🏮 Evening :
    {currencySymbol}{selectedCosts[`${day.dayNumber}-evening`] || 0}
  </p>

  <hr />

  <h3>
    Total :
   {currencySymbol}{
      (selectedCosts[`${day.dayNumber}-morning`] || 0) +
      (selectedCosts[`${day.dayNumber}-afternoon`] || 0) +
      (selectedCosts[`${day.dayNumber}-evening`] || 0)
    }
  </h3>
</div>
    </div>
  ))
) : (
  <div style={{ color: "#64748b", padding: "20px" }}>Generate your itinerary to see results.</div>
)}

{generatedItinerary && (
  <div style={{ textAlign: "center", marginTop: "25px" }}>
    <button
      onClick={downloadPDF}
      style={{
        padding: "14px 28px",
        background: "#38bdf8",
        color: "#0d0f17",
        border: "none",
        borderRadius: "12px",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onMouseEnter={(e) =>
        (e.target.style.background = "#0ea5e9")
      }
      onMouseLeave={(e) =>
        (e.target.style.background = "#38bdf8")
      }
    >
      📄 Download Selected Itinerary
    </button>
  </div>
)}

          {message && (
            <div
              style={{
                marginTop: "20px",
                color: message.startsWith("❌") ? "#ef4444" : "#34d399",
                fontWeight: "600",
              }}
            >
              {message}
            </div>
          )}
        </div>
        <div
          style={{
            marginTop: "40px",
            padding: "30px",
            background:
              "linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(13, 15, 23, 0.2))",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              marginTop: "40px",
              padding: "30px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
            }}
          >
            <h3
              style={{
                color: "#38bdf8",
                letterSpacing: "2px",
                fontSize: "0.9rem",
                marginBottom: "20px",
              }}
            >
              🛡️ FAIR CAB FARE ESTIMATOR
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div
                style={{
                  background: "rgba(0,0,0,0.2)",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <div style={{ color: "#a1a1aa", fontSize: "0.75rem" }}>
                  SHORT TRIP (2-5km)
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  ~{Math.round((countryData.farePerKm || 20) * 3)}{" "}
                  {countryData.currency
                    ? countryData.currency.split(" ")[1]
                    : "INR"}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(0,0,0,0.2)",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <div style={{ color: "#a1a1aa", fontSize: "0.75rem" }}>
                  CITY TRANSFER (10km+)
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  ~{Math.round((countryData.farePerKm || 20) * 10)}{" "}
                  {countryData.currency
                    ? countryData.currency.split(" ")[1]
                    : "INR"}
                </div>
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              marginTop: "15px",
              fontStyle: "italic",
            }}
          >
            * Always ask the driver to "start the meter" or use ride-sharing
            apps like Uber/Grab/Ola to avoid negotiations.
          </p>
        </div>
        {/* 🎯 FIX: NEW INTERACTIVE MULTI-OPTION SEACTION MATRIX CONTROLLER */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "40px",
          }}
        >
        </div>
      </div>
    </div>
  );
}
export default CountryPage;

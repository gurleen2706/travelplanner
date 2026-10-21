import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Itinerary() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/trips', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(response.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <h1>Your Itinerary</h1>
      {trips.length > 0 ? (
        trips.map((trip) => (
          <div key={trip._id}>
            <h3>{trip.destination}</h3>
            {/* Add more trip details here */}
          </div>
        ))
      ) : (
        <p style={{ color: "var(--text)" }}>No trips found. Start planning!</p>
      )}
    </div>
  );
}

export default Itinerary;
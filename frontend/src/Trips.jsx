import { useState, useEffect } from "react";

function Trips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/trips");
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <h2>All Trips</h2>
      {trips.length === 0 ? (
        <p>No trips yet.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>
              <strong>{trip.destination}</strong>  
              ({trip.startDate.slice(0, 10)} → {trip.endDate.slice(0, 10)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Trips;

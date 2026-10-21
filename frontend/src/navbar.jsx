import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear from storage
    setToken(null);                  // Clear from React state
    navigate('/login');              // Redirect user back to login
  };

return (
  <nav className="navbar">
   <div
  className="brand"
  onClick={() => navigate("/")}
>
    TRAVEL ✈ PLANNER
</div>

    <div className="nav-links">
      <NavLink to="/" className="nav-item">
        Home
      </NavLink>

      {token ? (
        <>
          <NavLink to="/itinerary" className="nav-item">
            My Itinerary
          </NavLink>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className="nav-item">
            Login
          </NavLink>

          <NavLink to="/register" className="nav-item">
            Register
          </NavLink>
        </>
      )}
    </div>
  </nav>
);
}

export default Navbar;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);

      navigate("/itinerary");
    } catch (error) {
      alert("Invalid Email or Password");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(rgba(20, 18, 8, 0.92), rgba(8,10,20,.92)), url('/images/bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
  };

  const cardStyle = {
    width: "420px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(5, 4, 2, 0.55)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(242, 244, 145, 0.25)",
    boxShadow: "0 10px 35px rgba(0,0,0,.4)",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginTop: "18px",
    borderRadius: "12px",
    border: "1px solid rgba(241, 246, 122, 0.71)",
    background: "rgba(255,255,255,.04)",
    color: "white",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    marginTop: "28px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: "#f9fc88",
    color: "#181707",
    fontWeight: "700",
    fontSize: "16px",
    transition: ".3s",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
       <h1
  style={{
    color: "#f9fc88",
    textAlign: "center",
    margin: "0 0 16px 0",
    fontSize: "38px",
    fontWeight: "700",
    lineHeight: "1.3",
    letterSpacing: "1px",
  }}
>
  Welcome Back
</h1>
        <p
          style={{
            color: "#b8b894",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          LOGIN TO TRAVEL ✈ PLANNER
        </p>

        <form onSubmit={handleLogin}>
          <input
            style={inputStyle}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.background = "#f5eb7c")}
            onMouseLeave={(e) => (e.target.style.background = "#f7ec8a")}
          >
            LOGIN
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#b8b694",
            marginTop: "24px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#f6f687",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
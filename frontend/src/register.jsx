import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });

      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      alert(
        "Registration Failed : " +
          (error.response?.data?.message || "Error")
      );
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(rgba(20, 20, 8, 0.92), rgba(11, 11, 5, 0.92)), url('/images/bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
  };

  const cardStyle = {
    width: "420px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(242, 248, 56, 0.25)",
    boxShadow: "0 10px 35px rgba(0,0,0,.4)",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    marginTop: "18px",
    borderRadius: "12px",
    border: "1px solid rgba(232, 248, 56, 0.25)",
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
    background: "#fbee8f",
    color: "#071018",
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
            marginBottom: "8px",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            color: "#b8b894",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          JOIN TRAVEL ✈ PLANNER
        </p>

        <form onSubmit={handleRegister}>
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
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) =>
              (e.target.style.background = "#efec81")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "#fbf59a")
            }
          >
            CREATE ACCOUNT
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#b8b594",
            marginTop: "24px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#f9f28e",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
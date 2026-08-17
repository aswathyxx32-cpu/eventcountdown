import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://daydream-7ho9.onrender.com";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    fetch(`${API_URL}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        return data;
      })
      .then((data) => {
        console.log("REGISTER RESPONSE:", data);

        if (data.error) {
          setMessage(data.error);
          return;
        }

        setMessage("Account created successfully! ✨");

        setUsername("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      })
      .catch((error) => {
        console.error("Registration error:", error);

        setMessage(
          error.message || "Unable to connect to server."
        );
      });
  };

  return (
    <div className="auth-form">

      <h1>Daydream ✨</h1>

      <h2>Create Your Account</h2>

      <p className="login-caption">
        Your next special moment starts here.
      </p>

      <p className="login-subcaption">
        Create an account and start counting down.
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">
          Create Account
        </button>

      </form>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

      <p>
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </p>

    </div>
  );
}

export default Register;

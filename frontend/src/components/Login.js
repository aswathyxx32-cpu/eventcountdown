import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://daydream-7ho9.onrender.com";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    fetch(`${API_URL}/api/login/`, {
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
          throw new Error(data.error || "Login failed");
        }

        return data;
      })
      .then((data) => {
        console.log("LOGIN RESPONSE:", data);

        if (data.error) {
          setMessage(data.error);
          return;
        }

        const user = {
          id: data.user_id,
          username: data.username,
          token: data.token || null,
        };

        localStorage.setItem("user", JSON.stringify(user));

        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setMessage(error.message || "Unable to connect to server.");
      });
  };

  return (
    <div className="auth-form">

      <h1>Daydream ✨</h1>

      <h2>Welcome Back</h2>

      <p className="login-caption">
        Every moment is worth dreaming about.
      </p>

      <p className="login-subcaption">
        Keep track of the moments you're looking forward to.
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Create one
        </Link>
      </p>

    </div>
  );
}

export default Login;
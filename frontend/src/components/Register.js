import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();

    setMessage("");

    // Check passwords
    if (password !== confirmPassword) {

      setMessage("Passwords do not match.");

      return;
    }

    fetch(
      "http://127.0.0.1:8000/api/register/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    )

      .then((response) => {
        return response.json();
      })

      .then((data) => {

        console.log(
          "REGISTER RESPONSE:",
          data
        );

        // Registration failed
        if (data.error) {

          setMessage(data.error);

          return;
        }

        // Registration successful
        setMessage(
          "Account created successfully! ✨"
        );

        // Clear form
        setUsername("");
        setPassword("");
        setConfirmPassword("");

        // Go to login after short delay
        setTimeout(() => {

          navigate("/login");

        }, 1200);

      })

      .catch((error) => {

        console.error(
          "Registration error:",
          error
        );

        setMessage(
          "Unable to connect to server."
        );

      });

  };

  return (

    <div className="auth-form">

      <h1>
        Daydream ✨
      </h1>

      <h2>
        Create Your Account
      </h2>

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
          onChange={(e) =>
            setUsername(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
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

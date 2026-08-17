import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();


  const handleSubmit = (e) => {

    e.preventDefault();

    setMessage("");


    fetch(
      "http://127.0.0.1:8000/api/login/",
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

      .then((response) => response.json())

      .then((data) => {

        console.log(
          "LOGIN RESPONSE:",
          data
        );


        // Login failed
        if (data.error) {

          setMessage(data.error);

          return;

        }


        // Make sure token exists
        if (!data.token) {

          setMessage(
            "Login failed: No token received."
          );

          return;

        }


        // Save logged-in user
        const user = {

          id: data.user_id,

          username: data.username,

          token: data.token,

        };


        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );


        // Go to dashboard
        navigate("/dashboard");

      })

      .catch((error) => {

        console.error(
          "Login error:",
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
        Event Countdown
      </h1>


      <h2>
        Welcome Back ✨
      </h2>


      <p className="login-caption">
        Every moment is worth counting down to.
      </p>


      <p className="login-subcaption">
        Keep track of the moments that matter.
      </p>


      <form
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          required
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
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
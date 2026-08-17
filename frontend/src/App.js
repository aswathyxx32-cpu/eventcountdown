import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Register Page */}
        <Route
          path="/register"
          element={<Register />}
        />


        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* Default page */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* Unknown page */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;

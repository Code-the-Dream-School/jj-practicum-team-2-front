// import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import { getAllData } from "./util/index";
import NoPage from "./pages/NoPage";
import SignUp from "./features/auth/pages/Signuppage";
import Login from "./features/auth/pages/LoginPage";
// const URL = "http://localhost:8000/api/v1/";
import { AuthProvider } from "./context/AuthContext";
import Router from "./router/Router";
import "./index.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NoPage />} />
      </Routes>

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">MentorHub</h1>
          <p className="text-lg text-slate-600">
            Welcome to MentorHub! Your gateway to connecting with mentors and
            advancing your career.
          </p>
        </div>
      </div>

      <AuthProvider>
        <Router />
      </AuthProvider>
    </>
  );
}

export default App;

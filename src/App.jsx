import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { getAllData } from "./util/index";
import NoPage from "./pages/NoPage";
import SignUp from "./features/auth/pages/Signuppage";
import Login from "./features/auth/pages/LoginPage";
const URL = "http://localhost:8000/api/v1/";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const myData = await getAllData(URL);
      setMessage(myData.data);
    })();

    return () => {
      console.log("unmounting");
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<h1>{message}</h1>} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import SignUp from "./features/auth/pages/SignupPage";
import Login from "./features/auth/pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import Router from "./router/Router";
import "./index.css";
function App() {
  return (
      <AuthProvider>
        <Router />
      </AuthProvider>
  );
}

export default App;

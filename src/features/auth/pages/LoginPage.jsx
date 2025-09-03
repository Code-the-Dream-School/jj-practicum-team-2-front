import React from "react";
import WelcomeSidebar from "../../components/WelcomeSidebar";
import LoginForm from "../components/LoginForm";
const Login = () => {
  return (
    <div className="flex w-full h-screen flex-wrap lg:flex-nowrap text-center">
      {/* welcome sidebar */}
      <WelcomeSidebar />
      {/* form sidebar */}
      <LoginForm />
    </div>
  );
};
export default Login;

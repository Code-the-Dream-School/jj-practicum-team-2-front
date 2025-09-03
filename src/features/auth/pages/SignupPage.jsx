import React from "react";
import WelcomeSidebar from "../../components/WelcomeSidebar";
import SignupForm from "../components/SignupForm";
const SignUp = () => {
  return (
    <div className="flex w-full h-screen flex-wrap lg:flex-nowrap text-center">
      {/* left side */}
      <WelcomeSidebar />
      {/* right side */}
      <SignupForm />
    </div>
  );
};

export default SignUp;

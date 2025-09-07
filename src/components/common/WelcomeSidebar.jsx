import React from "react";
import logo from "../../assets/image12.png";
const WelcomeSidebar = () => {
  return (
    <div
      className="w-full lg:w-1/2 bg-blue-900 text-white flex flex-col justify-center items-center h-64 lg:h-screen p-8"
      style={{
        background: "#102C54",
      }}
    >
      <div>
        <span className="flex justify-center">
          {" "}
          <img
            className="h-20 w-20 object-scale-down "
            src={logo}
            alt="logo"
          />{" "}
        </span>
        <h1 className="text-3xl font-bold mt-4">Welcome to MentorHub</h1>
        <h4 className="mt-2 text-lg">
          your centeralized hub for CTD mentorship. <br />
          Never miss a session.
        </h4>
      </div>
    </div>
  );
};
export default WelcomeSidebar;

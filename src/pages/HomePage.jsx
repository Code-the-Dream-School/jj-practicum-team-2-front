import CTDLogo from "../components/common/CTDLogo";

const HomePage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Welcome */}
      <div
        className="flex-1 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white flex flex-col items-center justify-between p-12 pt-48"
        style={{ backgroundColor: "#12284C" }}
      >
        <div className="flex flex-col items-center">
          {/* Logo and heading container */}
          <div className="flex flex-col items-center mb-16">
            {/* CTD Logo */}
            <div className="mb-6">
              <CTDLogo size="medium" variant="light" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight text-white text-center">
              Welcome to MentorHub!
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="text-center max-w-lg space-y-2">
            <div className="space-y-2 text-slate-200 text-xl">
              <p>Your centralized hub</p>
              <p>for CTD mentorship sessions.</p>
              <p className="font-semibold text-white mt-4 text-xl">
                Never miss a session!
              </p>
            </div>
          </div>
        </div>

        {/* Learn More Link */}
        <button className="text-orange-400 hover:text-orange-300 text-xl underline underline-offset-4 transition-colors duration-200 mb-8">
          Learn more about MentorHub
        </button>
      </div>

      {/* Right side - Sign In */}
      <div className="flex-1 bg-gray-50 flex flex-col items-center justify-between p-12 pt-48">
        <div className="w-full max-w-sm flex flex-col">
          {/* Logo and heading container */}
          <div className="flex flex-col items-center mb-16">
            {/* CTD Logo */}
            <div className="mb-6">
              <CTDLogo size="medium" variant="dark" />
            </div>

            {/* Heading - increased font size */}
            <h2 className="text-4xl font-bold text-center text-slate-800">
              Sign In to MentorHub
            </h2>
          </div>

          {/* Sign In Form */}
          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white p-4 rounded-lg hover:opacity-90 transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-6"
              style={{ backgroundColor: "#12284C" }}
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-gray-600 text-xl">
            Don't have an account?{" "}
            <span
              className="cursor-pointer font-semibold transition-colors duration-200 hover:underline"
              style={{ color: "#FF5C35" }}
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* Bottom container for symmetry with left side */}
        <div className="mb-8"></div>
      </div>
    </div>
  );
};

export default HomePage;

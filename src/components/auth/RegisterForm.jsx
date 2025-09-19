import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const initialSignUpData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    isMentor: "",
  };
  const [signUpData, setSignUpData] = useState(initialSignUpData);
  const [signUpDataErrors, setSignUpDataError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "isMentor") {
      setSignUpData({
        ...signUpData,
        role: checked ? "mentor" : "student",
      });
    } else {
      setSignUpData({
        ...signUpData,
        [name]: value,
      });
    }
  };

  const validate = (val) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!val.firstName) {
      errors.firstName = "First name is required!";
    } else if (!/^[a-zA-Z\s]+$/.test(val.firstName)) {
      errors.firstName = "First name can only contain letters and spaces!";
    }

    if (!val.lastName) {
      errors.lastName = "Last name is required!";
    } else if (!/^[a-zA-Z\s]+$/.test(val.lastName)) {
      errors.lastName = "Last name can only contain letters and spaces!";
    }

    if (!val.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(val.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!val.password) {
      errors.password = "Password is required!";
    } else if (val.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (val.password.length > 20) {
      errors.password = "Password cannot exceed 20 characters";
    }

    if (!val.confirmPassword) {
      errors.confirmPassword = "Please confirm your password!";
    } else if (val.password !== val.confirmPassword) {
      errors.confirmPassword = "Passwords do not match!";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(signUpData);
    setSignUpDataError(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      const payload = {
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
        password: signUpData.password,
        role: signUpData.role || "student",
        bio: signUpData.bio,
      };

      const result = await register(payload);
      setIsSubmitting(false);

      if (result.success) navigate("/login");
      else setSignUpDataError({ api: result.error });
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
      <h3 className="text-2xl font-semibold mb-2">MentorHub</h3>
      <p className="mb-6 text-gray-600">Welcome! Please enter your details.</p>
      <div className="container">
        {signUpDataErrors.api && (
          <div
            className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            {signUpDataErrors.api}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="w-full max-w-md">
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="mb-4">
              <label
                htmlFor="fname"
                className="block mb-1 text-left text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                value={signUpData.firstName}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="John"
              />
              <p className="text-sm text-red-800">
                {signUpDataErrors.firstName}
              </p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="lname"
                className="block mb-1 text-left text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                value={signUpData.lastName}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Doe"
              />
              <p className="text-sm text-red-800">
                {signUpDataErrors.lastName}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 text-left text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              onChange={handleChange}
              value={signUpData.email}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="john.doe@company.com"
            />
            <p className="text-sm text-red-800">{signUpDataErrors.email}</p>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-1 text-left text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={signUpData.password}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="*******"
            />
            <p className="text-sm text-red-800">{signUpDataErrors.password}</p>
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block mb-1 text-left text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              value={signUpData.confirmPassword}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="*******"
            />
            <p className="text-sm text-red-800">
              {signUpDataErrors.confirmPassword}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block mb-1 text-left text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              onChange={handleChange}
              value={signUpData.bio}
              className="block w-full text-sm p-2 border rounded-lg focus:ring-blue-500 border-gray-300"
              placeholder="Your bio here..."
              style={{
                focusRingColor: "#102C54",
              }}
            ></textarea>
          </div>

          <div className="flex items-center mb-4">
            <input
              id="default-checkbox"
              name="isMentor"
              onChange={handleChange}
              type="checkbox"
              value={signUpData.isMentor}
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded-sm dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="ms-2 text-sm font-medium text-gray-700"
            >
              I am a Mentor
            </label>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-3xs bg-blue-900 text-white py-2 rounded"
              style={{
                background: "#102C54",
              }}
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>
          </div>
          <div>
            <p className="text-gray-600">
              Do you have an account?{" "}
              <Link to="/Login" className="text-red-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
export default RegisterForm;

const CTDLogo = ({ size = "medium", variant = "light" }) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-20 h-20",
  };

  const bgColor = variant === "light" ? "#FF5C35" : "#12284C";

  const renderClip = () => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-1/2 h-1/2"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    );
  };

  return (
    <div
      className={`text-white ${sizeClasses[size]} rounded-xl shadow-lg flex items-center justify-center`}
      style={{ backgroundColor: bgColor }}
    >
      {renderClip()}
    </div>
  );
};

export default CTDLogo;

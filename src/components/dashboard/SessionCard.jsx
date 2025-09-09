import { useState } from "react";

export default function SessionCard({
  session,
  statusType,
  isRegistered,
  onRegister,
  onUnregister,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await action();
      if (!result.success) {
        setMessage(result.message);
      } else {
        setMessage(result.message);
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      console.error("Session action error:", error);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (statusType) {
      case "inProgress":
        return (
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
          </div>
        );
      case "upcoming":
        return (
          <div className="w-5 h-5 border-2 border-orange-500 rounded-full flex items-center justify-center relative">
            <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
            <div className="absolute w-2 h-0.5 bg-orange-500 origin-bottom rotate-45 translate-x-0.5"></div>
            <div className="absolute w-1.5 h-0.5 bg-orange-500 origin-bottom rotate-90 translate-y-0.5"></div>
          </div>
        );
      case "past":
        return (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-45 -translate-y-0.5 translate-x-0.5"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButton = () => {
    switch (statusType) {
      case "inProgress":
        return (
          <button
            onClick={() => window.open(session.zoomLink, "_blank")}
            disabled={!session.zoomLink}
          >
            {session.zoomLink ? "Join Session" : "No Link Available"}
          </button>
        );
      case "upcoming":
        return isRegistered ? (
          <button
            onClick={() => handleAction(onUnregister)}
            disabled={isLoading}
          >
            {isLoading ? "Canceling..." : "Cancel Registration"}
          </button>
        ) : (
          <button
            onClick={() => handleAction(onRegister)}
            disabled={
              isLoading || session.participants?.length >= session.capacity
            }
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Registering...
              </span>
            ) : session.participants?.length >= session.capacity ? (
              "Session Full"
            ) : (
              "Book Session"
            )}
          </button>
        );
      case "past":
        return (
          <button
            onClick={() => window.open(session.recordingUrl, "_blank")}
            disabled={!session.recordingUrl}
          >
            {session.recordingUrl ? "Watch Recording" : "No Recording"}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="info-card">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">{getStatusIcon()}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-0 flex-1 ml-3 leading-none">
          {session.title}
        </h3>
      </div>

      <div className="card-content">
        <p>
          Mentor: {session.mentorId?.firstName} {session.mentorId?.lastName}
        </p>
        <p>{formatDate(session.date)}</p>
        {session.courseName && <p>Course: {session.courseName}</p>}
        {isRegistered && statusType === "upcoming" && (
          <p className="text-green-600">✓ You&apos;re registered</p>
        )}
        {getActionButton()}

        {/* Message display */}
        {message && (
          <div
            className={`mt-2 p-2 text-sm rounded message-fade-in ${
              message.includes("Success") ||
              message.includes("registered") ||
              message.includes("unregistered")
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

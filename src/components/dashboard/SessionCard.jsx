import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function SessionCard({
  session,
  statusType,
  isRegistered,
  onRegister,
  onUnregister,
  onEditSession,
  onSessionUpdate, // Add callback for session updates
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { isMentor } = useAuth();

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

  // Mentor-specific actions
  const handleMarkAttendance = async () => {
    window.location.href = `/attendance?sessionId=${session._id}`;
    return { success: true, message: "Redirecting to attendance page..." };
  };

  const handleEditSession = async () => {
    if (onEditSession) {
      onEditSession(session);
    }
    return { success: true, message: "Opening edit modal..." };
  };

  // New status management functions
  const handleUpdateStatus = async (newStatus, actionName) => {
    const confirmMessages = {
      ongoing: `Start "${session.title}" session now?`,
      completed: `Mark "${session.title}" as completed?`,
      canceled: `Cancel "${session.title}" session?`,
    };

    const confirmed = window.confirm(confirmMessages[newStatus]);
    if (!confirmed) {
      return { success: false, message: "Action cancelled" };
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/sessions/${session._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || `Failed to ${actionName.toLowerCase()}`,
        };
      }

      // Call parent component to refresh data
      if (onSessionUpdate) {
        setTimeout(() => {
          onSessionUpdate();
        }, 1000);
      }

      const successMessage = `Session ${actionName.toLowerCase()} successfully!`;

      // If completed, redirect to attendance page after short delay
      if (newStatus === "completed") {
        setTimeout(() => {
          window.location.href = `/attendance?sessionId=${session._id}`;
        }, 2000);
        return {
          success: true,
          message: `${successMessage} Redirecting to attendance...`,
        };
      }

      return { success: true, message: successMessage };
    } catch (error) {
      console.error(`${actionName} session error:`, error);
      return {
        success: false,
        message: `Failed to ${actionName.toLowerCase()}. Please try again.`,
      };
    }
  };

  const handleStartSession = async () => {
    return handleUpdateStatus("ongoing", "Start");
  };

  const handleEndSession = async () => {
    return handleUpdateStatus("completed", "Complete");
  };

  const handleCancelSession = async () => {
    return handleUpdateStatus("canceled", "Cancel");
  };

  // Legacy function for Zoom link opening
  const handleJoinSession = async () => {
    if (session.zoomLink) {
      window.open(session.zoomLink, "_blank");
      return { success: true, message: "Opening Zoom session..." };
    }
    return { success: false, message: "No Zoom link available" };
  };

  const getStatusIcon = () => {
    // Check if session is canceled
    if (session.status === "canceled") {
      return (
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <div className="text-white text-xs font-bold">✕</div>
        </div>
      );
    }

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
    // If session is canceled, show appropriate message and no action buttons
    if (session.status === "canceled") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-red-600 font-medium">
            This session has been canceled
          </p>
          <p className="text-red-500 text-sm mt-1">
            {isMentor()
              ? "You canceled this session"
              : "The mentor canceled this session"}
          </p>
        </div>
      );
    }

    if (isMentor()) {
      switch (statusType) {
        case "inProgress":
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(handleJoinSession)}
                disabled={!session.zoomLink || isLoading}
                className="btn btn-primary btn-rounded"
              >
                {session.zoomLink ? "Join Session" : "No Link Available"}
              </button>
              <button
                onClick={() => handleAction(handleEndSession)}
                disabled={isLoading}
                className="btn btn-primary btn-rounded"
              >
                {isLoading ? "Ending..." : "End Session"}
              </button>
            </div>
          );
        case "upcoming":
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(handleStartSession)}
                disabled={isLoading}
                className="btn btn-primary btn-rounded"
              >
                {isLoading ? "Starting..." : "Start Session"}
              </button>
              <button
                onClick={() => handleAction(handleEditSession)}
                disabled={isLoading}
                className="btn btn-secondary btn-rounded"
              >
                {isLoading ? "Loading..." : "Edit Session"}
              </button>
              <button
                onClick={() => handleAction(handleCancelSession)}
                disabled={isLoading}
                className="btn btn-danger btn-rounded"
              >
                {isLoading ? "Canceling..." : "Cancel Session"}
              </button>
            </div>
          );
        case "past":
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(handleMarkAttendance)}
                disabled={isLoading}
                className="btn btn-primary btn-rounded"
              >
                {isLoading ? "Updating..." : "Mark Attendance"}
              </button>
              {session.recordingUrl && (
                <button
                  onClick={() => window.open(session.recordingUrl, "_blank")}
                  className="btn btn-secondary btn-rounded"
                >
                  Watch Recording
                </button>
              )}
            </div>
          );
      }
    } else {
      switch (statusType) {
        case "inProgress":
          return (
            <button
              onClick={() => window.open(session.zoomLink, "_blank")}
              disabled={!session.zoomLink}
              className="btn btn-primary btn-rounded"
            >
              Join Session
            </button>
          );
        case "upcoming":
          return isRegistered ? (
            <button
              onClick={() => handleAction(onUnregister)}
              disabled={isLoading}
              className="btn btn-danger btn-rounded"
            >
              {isLoading ? "Canceling..." : "Cancel Registration"}
            </button>
          ) : (
            <button
              onClick={() => handleAction(onRegister)}
              disabled={
                isLoading || session.participants?.length >= session.capacity
              }
              className="btn btn-primary btn-rounded"
            >
              {isLoading
                ? "Registering..."
                : session.participants?.length >= session.capacity
                  ? "Session Full"
                  : "Book Session"}
            </button>
          );
        case "past":
          return (
            <button
              onClick={() => window.open(session.recordingUrl, "_blank")}
              disabled={!session.recordingUrl}
              className="btn btn-secondary btn-rounded"
            >
              {session.recordingUrl ? "Watch Recording" : "No Recording"}
            </button>
          );
      }
    }
    return null;
  };

  return (
    <div className="info-card">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">{getStatusIcon()}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-0 flex-1 ml-3 leading-none">
          {session.title}
        </h3>
        {isMentor() && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>👥</span>
            <span>
              {session.participants?.length || 0}/{session.capacity}
            </span>
          </div>
        )}
      </div>

      <div className="card-content">
        {/* Add session description if it exists */}
        {session.description && (
          <p className="text-gray-600 text-sm mb-2 italic break-words overflow-wrap-anywhere leading-relaxed">
            {session.description}
          </p>
        )}
        {!isMentor() && (
          <p>
            Mentor: {session.mentorId?.firstName} {session.mentorId?.lastName}
          </p>
        )}
        <p>{formatDate(session.date)}</p>
        {session.courseName && <p>Course: {session.courseName}</p>}
        {isRegistered && statusType === "upcoming" && !isMentor() && (
          <p className="text-green-600">✓ You&apos;re registered</p>
        )}
        {getActionButton()}

        {/* Message display */}
        {message && (
          <div
            className={`mt-2 p-2 text-sm rounded message-fade-in ${
              message.includes("Success") ||
              message.includes("registered") ||
              message.includes("unregistered") ||
              message.includes("started") ||
              message.includes("Redirecting to attendance") ||
              message.includes("Opening")
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

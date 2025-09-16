import { useState } from "react";

export default function SessionActions({
  session,
  statusType,
  isRegistered,
  onRegister,
  onUnregister,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAction = async (action) => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await action();
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message);
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const joinSession = () => {
    if (session.zoomLink) {
      window.open(session.zoomLink, "_blank");
    }
  };

  const watchRecording = () => {
    if (session.recordingUrl) {
      window.open(session.recordingUrl, "_blank");
    }
  };

  const renderActions = () => {
    switch (statusType) {
      case "inProgress":
        return (
          <button
            className="btn-accent w-full"
            onClick={joinSession}
            disabled={!session.zoomLink}
          >
            <span className="inline-block w-4 h-4 mr-2 text-center">▶️</span>
            Join Session
          </button>
        );

      case "upcoming":
        return (
          <div className="space-y-2">
            {!isRegistered ? (
              <button
                className="btn-primary w-full"
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
                  <>
                    <span className="inline-block w-4 h-4 mr-2 text-center">
                      ➕
                    </span>
                    Book Session
                  </>
                )}
              </button>
            ) : (
              <button
                className="btn-secondary w-full"
                onClick={() => handleAction(onUnregister)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Canceling...
                  </span>
                ) : (
                  <>
                    <span className="inline-block w-4 h-4 mr-2 text-center">
                      ❌
                    </span>
                    Cancel Registration
                  </>
                )}
              </button>
            )}
          </div>
        );

      case "past":
        return (
          <button
            className="btn-secondary w-full"
            onClick={watchRecording}
            disabled={!session.recordingUrl}
          >
            <span className="inline-block w-4 h-4 mr-2 text-center">🎥</span>
            {session.recordingUrl
              ? "Watch Recording"
              : "No Recording Available"}
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {renderActions()}
      {message && (
        <div
          className={`mt-2 p-2 text-sm rounded ${
            message.includes("Success") ||
            message.includes("registered") ||
            message.includes("unregistered")
              ? "bg-success bg-opacity-10 text-success"
              : "bg-error bg-opacity-10 text-error"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
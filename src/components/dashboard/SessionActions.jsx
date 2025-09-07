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
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
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
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </span>
                ) : session.participants?.length >= session.capacity ? (
                  "Session Full"
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
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
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Canceling...
                  </span>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
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
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5a9 9 0 1118 0z"
              />
            </svg>
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

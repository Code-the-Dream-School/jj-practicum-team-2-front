export default function SessionCard({
  session,
  statusType,
  isRegistered,
  onRegister,
  onUnregister,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAction = async (action) => {
    const result = await action();
    if (!result.success) {
      alert(result.message);
    }
  };

  const getActionButton = () => {
    switch (statusType) {
      case "inProgress":
        return (
          <button
            className="btn-accent w-full"
            onClick={() => window.open(session.zoomLink, "_blank")}
          >
            Join Session
          </button>
        );
      case "upcoming":
        return isRegistered ? (
          <button
            className="btn-secondary w-full"
            onClick={() => handleAction(onUnregister)}
          >
            Cancel Registration
          </button>
        ) : (
          <button
            className="btn-primary w-full"
            onClick={() => handleAction(onRegister)}
            disabled={session.participants?.length >= session.capacity}
          >
            {session.participants?.length >= session.capacity
              ? "Full"
              : "Book Session"}
          </button>
        );
      case "past":
        return (
          <button
            className="btn-secondary w-full"
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
    <div className="card p-4">
      <h3 className="font-semibold text-gray-900 mb-2">{session.title}</h3>

      <div className="text-sm text-gray-600 mb-3">
        <p>
          Mentor: {session.mentorId?.firstName} {session.mentorId?.lastName}
        </p>
        <p>{formatDate(session.date)}</p>
        {session.courseName && <p>Course: {session.courseName}</p>}
      </div>

      {isRegistered && statusType === "upcoming" && (
        <p className="text-sm text-green-600 mb-3">✓ Registered</p>
      )}

      {getActionButton()}
    </div>
  );
}

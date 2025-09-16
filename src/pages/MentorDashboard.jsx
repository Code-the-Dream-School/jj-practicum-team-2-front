import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import Loading from "../components/common/Loading";
import WeeklySessionsView from "../components/dashboard/WeeklySessionsView";
import Modal from "../components/common/Modal";

export default function MentorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sessions, setSessions] = useState([])
  const { user } = useAuth();
  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleCreateSession = (sessionData) => {
    setSessions((prev) => [
      ...prev,
      { 
        ...sessionData, 
        createdBy: user 
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim() 
          : "Unknown" 
      }
    ]);
    // send sessionData to backend here
  }

  const { dashboardData, loading, error, registerForSession, unregisterFromSession, } = useDashboard();

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {/* Header Section - using shared styles */}
      <div className="app-header">
        <div className="app-header__avatar">
          <span className="text-4xl">📅</span>
        </div>

        <div className="app-header__content text-center">
          <h1 className="app-header__title">This Week&apos;s Sessions</h1>
          <p className="app-header__description">
            All your mentorship sessions in one place, Never miss a sessions again
          </p>
        </div>
      </div>

      <div className="mb-4 mt-4">
        <button onClick={handleOpenModal} type="button" className="focus:outline-none text-dark bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2 me-2 mb-2 dark:bg-green-400 dark:hover:bg-green-700 dark:focus:ring-green-800">Create a New Session</button>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleCreateSession} />
        <ul>
          {sessions.map((session, idx) => (
            <li key={idx}>
              <strong>{session.title}</strong> <br />
              {session.date} | {session.type} | {session.duration} min <br />
              {session.description}
              <span className="text-xs text-gray-500">Created by: {session.createdBy}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sessions Content */}
      <div className="w-full max-w-4xl mt-6">
        <WeeklySessionsView
          sessionsData={dashboardData.thisWeek}
          myRegistrations={dashboardData.myRegistrations}
          onRegister={registerForSession}
          onUnregister={unregisterFromSession}
        />
      </div>
    </div>
  );
}

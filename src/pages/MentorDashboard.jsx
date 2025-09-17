import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import Loading from "../components/common/Loading";
import WeeklySessionsView from "../components/dashboard/WeeklySessionsView";
import Modal from "../components/common/Modal";
import EditSessionModal from "../components/common/EditSessionModal";
import { AcademicCapIcon } from "@heroicons/react/24/solid";

export default function MentorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [sessions, setSessions] = useState([]);
  const { user } = useAuth();
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateSession = async (sessionData) => {
    // First, get the default class ID
    try {
      const classResponse = await fetch(
        "http://localhost:8000/api/v1/classes",
        {
          credentials: "include",
        },
      );

      let defaultClassId;
      if (classResponse.ok) {
        const classes = await classResponse.json();
        defaultClassId = classes[0]?._id;
      }

      if (!defaultClassId) {
        alert("No classes available. Please contact administrator.");
        return;
      }

      const payload = {
        title: sessionData.title,
        description: sessionData.description,
        classId: defaultClassId,
        courseName: sessionData.courseName,
        mentorId: user.id,
        date: sessionData.date,
        zoomLink: sessionData.zoomLink,
        duration: sessionData.duration,
        type: sessionData.type,
        capacity: sessionData.capacity,
      };

      const response = await fetch("http://localhost:8000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
        return;
      }

      const newSession = await response.json();
      setSessions((prev) => [
        ...prev,
        {
          ...newSession,
          createdBy: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        },
      ]);

      alert("Session created successfully!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Create session error:", err);
      alert("Failed to create session. Please try again.");
    }
  };

  const handleEditSession = async (sessionData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/sessions/${sessionToEdit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(sessionData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
        return;
      }

      alert("Session updated successfully!");
      setIsEditModalOpen(false);
      setSessionToEdit(null);
      window.location.reload(); // Refresh to show updated session
    } catch (err) {
      console.error("Edit session error:", err);
      alert("Failed to update session. Please try again.");
    }
  };

  const openEditModal = (session) => {
    setSessionToEdit(session);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSessionToEdit(null);
  };

  const {
    dashboardData,
    loading,
    error,
    registerForSession,
    unregisterFromSession,
  } = useDashboard();

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
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="app-header__content text-center">
          <h1 className="app-header__title">This Week&apos;s Sessions</h1>
          <p className="app-header__description">
            All your mentorship sessions in one place, Never miss a sessions
            again
          </p>
        </div>
      </div>

      <div className="mb-4 mt-4">
        <button
          onClick={handleOpenModal}
          type="button"
          className="btn btn-primary btn-rounded"
        >
          Create a New Session
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateSession}
        />
        <ul>
          {sessions.map((session, idx) => (
            <li key={idx}>
              <strong>{session.title}</strong> <br />
              {session.date} | {session.type} | {session.duration} min <br />
              {session.description}
              <span className="text-xs text-gray-500">
                Created by: {session.createdBy}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateSession}
      />

      <EditSessionModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSession}
        session={sessionToEdit}
      />

      {/* Sessions Content */}
      <div className="w-full max-w-4xl mt-6">
        <WeeklySessionsView
          sessionsData={dashboardData.thisWeek}
          myRegistrations={dashboardData.myRegistrations}
          onRegister={registerForSession}
          onUnregister={unregisterFromSession}
          onEditSession={openEditModal}
        />
      </div>
    </div>
  );
}

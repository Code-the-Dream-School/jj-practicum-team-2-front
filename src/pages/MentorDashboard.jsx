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
  const { user } = useAuth();

  const {
    dashboardData,
    loading,
    error,
    registerForSession,
    unregisterFromSession,
    refreshDashboard,
  } = useDashboard();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateSession = async (sessionData) => {
    try {
      const payload = {
        title: sessionData.title,
        description: sessionData.description,
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

      alert("Session created successfully!");
      setIsModalOpen(false);
      refreshDashboard();
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
      refreshDashboard();
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

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="p-6">
        <div className="card p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button className="btn-primary" onClick={refreshDashboard}>
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
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <AcademicCapIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="app-header__content">
          <h1 className="app-header__title">This Week&apos;s Sessions</h1>
          <p className="app-header__description">
            All your mentorship sessions in one place.
            <br />
            Never miss your sessions!
          </p>
        </div>
      </div>

      <div className="mb-4 mt-4">
        <button
          onClick={handleOpenModal}
          type="button"
          className="btn btn-primary btn-rounded mr-4"
        >
          Create a New Session
        </button>
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
          onSessionUpdate={refreshDashboard}
        />
      </div>
    </div>
  );
}

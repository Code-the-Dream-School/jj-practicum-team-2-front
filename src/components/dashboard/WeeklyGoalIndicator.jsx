import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

export default function WeeklyGoalIndicator({
  attendedSessions = 0,
  weeklyGoal = 3,
  onGoalUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(weeklyGoal);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const messageTimeoutRef = useRef(null);

  const progressPercentage = Math.min(
    (attendedSessions / weeklyGoal) * 100,
    100,
  );
  const goalMet = attendedSessions >= weeklyGoal;

  const clearMessages = () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
      messageTimeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const handleGoalClick = () => {
    setTempGoal(weeklyGoal);
    setIsEditing(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSave = async () => {
    const goalValue = parseInt(tempGoal);

    setErrorMessage("");
    setSuccessMessage("");

    if (isNaN(goalValue) || tempGoal === "") {
      setErrorMessage("Please enter a valid number for your weekly goal.");
      setTempGoal(weeklyGoal);
      clearMessages();
      return;
    }

    if (goalValue < 1) {
      setErrorMessage("Weekly goal must be at least 1 session per week.");
      setTempGoal(weeklyGoal);
      clearMessages();
      return;
    }

    if (goalValue > 10) {
      setErrorMessage("Weekly goal cannot exceed 10 sessions per week.");
      setTempGoal(weeklyGoal);
      clearMessages();
      return;
    }

    setIsLoading(true);
    try {
      if (onGoalUpdate) {
        await onGoalUpdate(goalValue);
        setSuccessMessage("Weekly goal updated successfully!");
        clearMessages();

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update goal:", error);

      const serverError = error.message || "Failed to update weekly goal";
      setErrorMessage(`Unable to update weekly goal: ${serverError}`);
      setTempGoal(weeklyGoal);
      clearMessages();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempGoal(weeklyGoal);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setTempGoal("");
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      return;
    }

    if (numValue >= 0 && numValue <= 99) {
      setTempGoal(numValue);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Error/Success Messages */}
      {(errorMessage || successMessage) && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            errorMessage
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}
        >
          {errorMessage ? (
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          )}
          <span className="text-sm font-medium">
            {errorMessage || successMessage}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Goal Status and Progress */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-3 h-3 rounded-full ${goalMet ? "bg-green-500" : "bg-yellow-500"}`}
            ></div>
            <h3 className="text-lg font-semibold text-gray-900">
              {goalMet ? "Weekly goal met!" : "Working towards weekly goal"}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                goalMet ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-600">
            {attendedSessions} of {weeklyGoal} sessions completed this week
          </p>
        </div>

        {/* Session Counts */}
        <div className="flex gap-8">
          {/* Attended Column */}
          <div className="flex flex-col items-center min-w-[80px]">
            <div className="text-3xl font-bold text-blue-600 leading-none">
              {attendedSessions}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">
              Attended
            </div>
          </div>

          {/* Goal Column */}
          <div className="flex flex-col items-center min-w-[80px] relative">
            {/* Edit Mode Popup */}
            {isEditing && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10 -mt-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tempGoal}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  className="w-16 text-center text-2xl font-bold text-green-600 border border-gray-300 rounded px-1 py-1 mb-2"
                  autoFocus
                  disabled={isLoading}
                />
                <div className="flex gap-1 justify-center">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {isLoading ? "..." : "✓"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Goal Display */}
            <div
              className="cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors flex flex-col items-center"
              onClick={handleGoalClick}
              title="Click to edit weekly goal"
            >
              <div className="text-3xl font-bold text-green-600 leading-none">
                {weeklyGoal}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide mt-1 flex items-center gap-1">
                Goal
                <PencilIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

WeeklyGoalIndicator.propTypes = {
  attendedSessions: PropTypes.number,
  weeklyGoal: PropTypes.number,
  onGoalUpdate: PropTypes.func,
};

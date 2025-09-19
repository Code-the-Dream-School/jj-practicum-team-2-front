import React, { useState, useEffect } from "react";

function Modal({ isOpen, onClose, onSubmit, classes = [] }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    courseName: "",
    date: "",
    type: "lecture",
    capacity: 20,
    zoomLink: "",
    duration: 60,
  });

  // Reset form when modal is closed or set default class when modal opens
  useEffect(() => {
    if (!isOpen) {
      setForm({
        title: "",
        description: "",
        courseName: "",
        date: "",
        type: "lecture",
        capacity: 20,
        zoomLink: "",
        duration: 60,
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
            <h3 className="text-lg font-semibold text-black">
              Create a Session
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              aria-label="Close"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-black">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="bg-gray-100 border border-gray-300 text-black placeholder-gray-400 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5"
                  placeholder="Session title"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-black">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="block p-2.5 w-full text-sm text-black bg-gray-100 rounded-lg border border-gray-300 placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
                  placeholder="Session description"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-black">
                  Course Name
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  className="bg-gray-100 border border-gray-300 text-black placeholder-gray-400 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5"
                  placeholder="Course name (optional)"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-black">
                  Date / Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="bg-gray-100 border border-gray-300 text-black placeholder-gray-400 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-black">
                  Zoom Link
                </label>
                <input
                  type="url"
                  name="zoomLink"
                  value={form.zoomLink}
                  onChange={handleChange}
                  className="bg-gray-100 border border-gray-300 text-black placeholder-gray-400 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5"
                  placeholder="https://zoom.us/..."
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-black">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={form.duration}
                  onChange={handleChange}
                  className="bg-gray-100 border border-gray-300 text-black placeholder-gray-400 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-black">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="bg-gray-100 border border-gray-300 text-black placeholder-gray-400 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  required
                >
                  <option value="lecture">Lecture</option>
                  <option value="qna">Q&amp;A</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block mb-2 text-sm font-medium text-black">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  className="bg-gray-100 border border-gray-300 text-black placeholder-gray-400 text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <svg
                className="me-1 -ms-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Create Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;

export const mockStudents = [
  { id: "stu1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "stu2", name: "Bob Smith", email: "bob@example.com" },
  { id: "stu3", name: "Charlie Brown", email: "charlie@example.com" },
];

export const mockSessions = [
  {
    id: "sess1",
    title: "React Js",
    date: "2025-09-17T14:00:00Z",
    attendees: [mockStudents[0], mockStudents[1]],
  },
  {
    id: "sess2",
    title: "Node Js",
    date: "2025-09-18T16:00:00Z",
    attendees: [mockStudents[2]],
  },
];

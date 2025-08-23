import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";

export default function StudentProfile() {
  return (
    <ProtectedRoute requiredRole="student">
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Student Profile
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Student profile page content will be implemented here.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This page is only accessible to students and will include profile
              editing, learning goals, bio, and contact information features.
            </p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

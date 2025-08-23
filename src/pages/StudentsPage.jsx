import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";

export default function StudentsPage() {
  return (
    <ProtectedRoute requiredRole="mentor">
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Students Management
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Students management page content will be implemented here.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This page is only accessible to mentors.
            </p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

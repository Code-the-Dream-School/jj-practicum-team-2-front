import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";

export default function BrowseMentorsPage() {
  return (
    <ProtectedRoute requiredRole="student">
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Browse Mentors
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Browse mentors page content will be implemented here.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Students can view and browse mentor profiles, see their bios and
              specializations.
            </p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

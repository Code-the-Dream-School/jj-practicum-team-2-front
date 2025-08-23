import Layout from "../components/layout/Layout";

export default function MentorDashboard() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Mentor Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Mentor dashboard page content will be implemented here.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This page is only accessible to mentors and will include session
            management, student tracking, and reporting features.
          </p>
        </div>
      </div>
    </Layout>
  );
}

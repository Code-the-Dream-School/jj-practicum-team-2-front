import Layout from '../components/layout/Layout';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Stats</h3>
            <p className="text-gray-600">Dashboard content will be implemented here.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-gray-600">Recent activity will be shown here.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600">Latest notifications will appear here.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="text-9xl font-bold text-gray-300">404</h2>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">
              Page not found
            </h3>
            <p className="text-gray-600 mt-2">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
          style={{ borderTopColor: "#102C54" }}
        ></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

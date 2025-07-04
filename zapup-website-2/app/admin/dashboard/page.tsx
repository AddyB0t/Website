export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Textbooks</h3>
          <p className="text-3xl font-light">0</p>
          <p className="text-sm text-gray-500 mt-2">Total textbooks uploaded</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Questions</h3>
          <p className="text-3xl font-light">0</p>
          <p className="text-sm text-gray-500 mt-2">Total questions extracted</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Users</h3>
          <p className="text-3xl font-light">0</p>
          <p className="text-sm text-gray-500 mt-2">Registered users</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity</p>
      </div>
    </div>
  )
} 
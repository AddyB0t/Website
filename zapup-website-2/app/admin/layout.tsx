import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Check if user is authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Simple admin check - you can modify this based on your admin logic
  // For now, allowing all authenticated users to access admin (you can modify this)
  const isAdmin = true; // Modify this logic as needed

  if (!isAdmin) {
    redirect('/'); // Redirect non-admin users to home
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            <div className="text-sm text-gray-600">
              Welcome, Admin
            </div>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
} 
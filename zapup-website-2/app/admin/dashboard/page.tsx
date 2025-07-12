'use client';

import { useEffect, useState } from 'react';
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Settings, TestTube, Shield, Upload, BookOpen } from 'lucide-react';
import { BookUploadForm } from '@/components/BookUploadForm';

type AdminUser = {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  subscription_type?: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('explorer');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedBooks, setUploadedBooks] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchUploadedBooks();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/user-preferences');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      setUsers([]);
    }
    setLoading(false);
  }

  async function fetchUploadedBooks() {
    try {
      const res = await fetch('/api/admin/state-school-books');
      const data = await res.json();
      setUploadedBooks(data.books || []);
    } catch (e) {
      setUploadedBooks([]);
    }
  }

  async function updateUserSubscription(userId: string, newPlan: string) {
    try {
      const res = await fetch('/api/admin/update-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscriptionType: newPlan })
      });
      
      if (res.ok) {
        fetchUsers(); // Refresh the list
        setEditingUser(null);
      }
    } catch (e) {
      console.error('Failed to update subscription:', e);
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === "all" || !filter ? true : user.subscription_type === filter;
    const matchesSearch = searchTerm ? 
      (user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.user_id.toLowerCase().includes(searchTerm.toLowerCase())) : true;
    return matchesFilter && matchesSearch;
  });

  const planStats = {
    explorer: users.filter(u => u.subscription_type === 'explorer').length,
    scholar: users.filter(u => u.subscription_type === 'scholar').length,
    achiever: users.filter(u => u.subscription_type === 'achiever').length,
    genius_plus: users.filter(u => u.subscription_type === 'genius_plus').length,
  };

  const features = SUBSCRIPTION_FEATURES[selectedPlan as keyof typeof SUBSCRIPTION_FEATURES];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and test subscription features</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 pb-2">
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Total Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Explorer (Free)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-600">{planStats.explorer}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Scholar</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{planStats.scholar}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Achiever</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{planStats.achiever}</div>
          </CardContent>
        </Card>
      </div>

      {/* Book Upload Section */}
      <Card className="mb-6 bg-white border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
          <CardTitle className="flex items-center justify-between text-gray-800">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <span>Book Management</span>
            </div>
            <Button 
              onClick={() => setShowUploadForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Book
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">State-School-Class-Subject Books</h3>
            <p className="text-gray-600 mb-4">
              Upload and manage books organized by state, school, class, and subject
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{uploadedBooks.length}</div>
                <div className="text-sm text-gray-600">Total Books</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(uploadedBooks.map(book => book.state)).size}
                </div>
                <div className="text-sm text-gray-600">States Covered</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(uploadedBooks.map(book => book.subject_id)).size}
                </div>
                <div className="text-sm text-gray-600">Subjects Available</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <BookUploadForm 
              onUploadComplete={(book) => {
                setUploadedBooks(prev => [book, ...prev])
                setShowUploadForm(false)
              }}
              onClose={() => setShowUploadForm(false)}
            />
          </div>
        </div>
      )}

      {/* Feature Testing Section */}
      <Card className="mb-6 bg-white border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <TestTube className="w-5 h-5 text-purple-600" />
            <span>Feature Testing by Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Plan to Test:</label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="explorer">Explorer (Free)</SelectItem>
                <SelectItem value="scholar">Scholar</SelectItem>
                <SelectItem value="achiever">Achiever</SelectItem>
                <SelectItem value="genius_plus">Genius+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Questions Per Day</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <Badge variant={features.maxQuestionsPerDay === Infinity ? "default" : "secondary"}>
                  {features.maxQuestionsPerDay === Infinity ? "Unlimited" : features.maxQuestionsPerDay}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Allowed Classes</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <div className="flex flex-wrap gap-1 mb-2">
                  {features.allowedClasses.map(cls => (
                    <Badge key={cls} variant="outline" className="text-black border-gray-300">Class {cls}</Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  Can select: {features.maxClassesSelectable === Infinity ? "Multiple classes" : `${features.maxClassesSelectable} class${features.maxClassesSelectable === 1 ? '' : 'es'} at a time`}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Personalized Explanations</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <Badge variant={features.personalizedExplanations ? "default" : "secondary"}>
                  {features.personalizedExplanations ? "✓ Enabled" : "✗ Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Exam Mode</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <Badge variant={features.examMode ? "default" : "secondary"}>
                  {features.examMode ? "✓ Enabled" : "✗ Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Mock Tests</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <Badge variant={features.mockTests ? "default" : "secondary"}>
                  {features.mockTests ? "✓ Enabled" : "✗ Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Chatbot Access</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <Badge variant={features.chatbot ? "default" : "secondary"}>
                  {features.chatbot ? "✓ Enabled" : "✗ Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Image Upload</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <Badge variant={features.imageUpload ? "default" : "secondary"}>
                  {features.imageUpload ? "✓ Enabled" : "✗ Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Audio Explanations</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <Badge variant={features.audioExplanations ? "default" : "secondary"}>
                  {features.audioExplanations ? "✓ Enabled" : "✗ Disabled"}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Parent Dashboard</h4>
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                <Badge variant={features.parentDashboard ? "default" : "secondary"}>
                  {features.parentDashboard ? "✓ Enabled" : "✗ Disabled"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Shield className="w-5 h-5 text-green-600" />
            <span>User Subscription Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="explorer">Explorer</SelectItem>
                <SelectItem value="scholar">Scholar</SelectItem>
                <SelectItem value="achiever">Achiever</SelectItem>
                <SelectItem value="genius_plus">Genius+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">User ID</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Current Plan</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.user_id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-mono text-sm text-gray-900">
                        {user.user_id.substring(0, 8)}...
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-900">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-900">{user.email}</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <Badge 
                          variant={user.subscription_type === 'explorer' ? 'secondary' : 'default'}
                        >
                          {user.subscription_type}
                        </Badge>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        {editingUser === user.user_id ? (
                          <div className="flex gap-2">
                            <Select 
                              defaultValue={user.subscription_type} 
                              onValueChange={(value) => updateUserSubscription(user.user_id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="explorer">Explorer</SelectItem>
                                <SelectItem value="scholar">Scholar</SelectItem>
                                <SelectItem value="achiever">Achiever</SelectItem>
                                <SelectItem value="genius_plus">Genius+</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingUser(null)}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingUser(user.user_id)}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            Edit Plan
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
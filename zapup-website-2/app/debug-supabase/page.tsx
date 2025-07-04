'use client';

import { useEffect, useState } from 'react';
import { userPreferencesService } from '@/lib/supabase';

export default function DebugSupabasePage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<string>('');

  const addLog = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('🔍 Starting Supabase Debug Test...');
    
    // Test environment variables in browser
    addLog(`📍 Environment Variables:`);
    addLog(`- NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET'}`);
    addLog(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}`);
    
    // Test with a dummy user ID
    const testUserId = 'test-user-123';
    
    addLog(`🧪 Testing getUserPreferences with userId: ${testUserId}`);
    
    userPreferencesService.getUserPreferences(testUserId)
      .then(result => {
        if (result) {
          addLog(`✅ getUserPreferences returned data: ${JSON.stringify(result, null, 2)}`);
          setTestResult('SUCCESS: Data retrieved');
        } else {
          addLog(`ℹ️ getUserPreferences returned null (expected for new user)`);
          setTestResult('SUCCESS: No data (expected)');
        }
      })
      .catch(error => {
        addLog(`❌ getUserPreferences failed: ${error.message}`);
        setTestResult(`ERROR: ${error.message}`);
      });

    // Test connection directly
    addLog(`🔗 Testing database connection...`);
    userPreferencesService.testConnection()
      .then(success => {
        addLog(`🔗 Connection test result: ${success ? 'PASSED' : 'FAILED'}`);
      })
      .catch(error => {
        addLog(`❌ Connection test error: ${error.message}`);
      });

  }, []);

  const testSavePreferences = async () => {
    const testUserId = 'test-user-123';
    const testData = {
      user_id: testUserId,
      first_name: 'Test',
      last_name: 'User',
      school_board: 'CBSE' as const,
      class_level: '10' as const,
      profile_complete: false
    };

    addLog(`💾 Testing upsertUserPreferences...`);
    
    try {
      const result = await userPreferencesService.upsertUserPreferences(testData);
      if (result) {
        addLog(`✅ Save successful: ${JSON.stringify(result, null, 2)}`);
      } else {
        addLog(`❌ Save failed: No result returned`);
      }
    } catch (error) {
      addLog(`❌ Save error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔍 Supabase Debug Console</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-black text-green-400 p-3 rounded font-mono text-sm h-96 overflow-y-auto">
            {debugInfo.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Result</h3>
            <p className={`font-mono ${testResult.includes('ERROR') ? 'text-red-600' : 'text-green-600'}`}>
              {testResult || 'Running tests...'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Manual Tests</h3>
            <button 
              onClick={testSavePreferences}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Save Preferences
            </button>
          </div>

          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Expected Behavior</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Environment variables should be SET in browser</li>
              <li>✅ Connection test should PASS</li>
              <li>✅ Data should save to Supabase (not localStorage)</li>
              <li>❌ If using localStorage = Supabase connection failed</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions</h3>
        <p className="text-sm">
          1. Check the debug logs above to see which storage method is being used<br/>
          2. Look for "✅ Supabase credentials found" or "❌ Missing Supabase credentials"<br/>
          3. If seeing localStorage fallback, check the specific error messages<br/>
          4. Open browser DevTools Console for additional logs
        </p>
      </div>
    </div>
  );
} 
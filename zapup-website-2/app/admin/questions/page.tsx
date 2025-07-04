export default function QuestionBank() {
  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-800 mb-6">Question Bank</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-700">All Questions</h2>
          <div className="space-x-2">
            <select className="border border-gray-300 rounded-md text-sm px-3 py-2">
              <option>All Books</option>
              <option>ICSE Class 6 Maths</option>
              <option>CBSE Class 9 Science</option>
            </select>
            <select className="border border-gray-300 rounded-md text-sm px-3 py-2">
              <option>All Chapters</option>
              <option>Chapter 1</option>
              <option>Chapter 2</option>
            </select>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-center text-gray-500" colSpan={5}>
                  No questions available. Upload a textbook to extract questions.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 
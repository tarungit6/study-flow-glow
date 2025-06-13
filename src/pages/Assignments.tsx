import React from 'react';

const assignments = [
  { id: 1, title: 'Math Assignment #5', course: 'Advanced Mathematics', due: 'Today', status: 'Pending' },
  { id: 2, title: 'CS Project', course: 'Computer Science', due: 'Tomorrow', status: 'Submitted' },
  { id: 3, title: 'Physics Lab Report', course: 'Physics Fundamentals', due: '3 days', status: 'Pending' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Submitted: 'bg-green-100 text-green-800',
};

export default function Assignments() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="pb-2">Title</th>
              <th className="pb-2">Course</th>
              <th className="pb-2">Due</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="py-3 font-medium">{a.title}</td>
                <td className="py-3">{a.course}</td>
                <td className="py-3">{a.due}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[a.status]}`}>{a.status}</span>
                </td>
                <td className="py-3">
                  <button className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80 transition text-xs">{a.status === 'Pending' ? 'Submit' : 'View'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
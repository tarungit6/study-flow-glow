import React from 'react';
import { Link } from 'react-router-dom';

const assignments = [
  { id: 1, title: 'Math Assignment #5', course: 'Advanced Mathematics', due: 'Today', status: 'Pending' },
  { id: 2, title: 'CS Project', course: 'Computer Science', due: 'Tomorrow', status: 'Submitted' },
  { id: 3, title: 'Physics Lab Report', course: 'Physics Fundamentals', due: '3 days', status: 'Pending' },
];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Submitted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export default function Assignments() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Link to="/" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition">Back to Home</Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 dark:text-gray-300 text-sm">
              <th className="pb-2">Title</th>
              <th className="pb-2">Course</th>
              <th className="pb-2">Due</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="py-3 font-medium text-gray-900 dark:text-white">{a.title}</td>
                <td className="py-3 text-gray-700 dark:text-gray-200">{a.course}</td>
                <td className="py-3 text-gray-700 dark:text-gray-200">{a.due}</td>
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
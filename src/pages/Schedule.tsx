import React from 'react';
import { Link } from 'react-router-dom';

const events = [
  { id: 1, title: 'Math Assignment #5 Due', type: 'Assignment', date: 'Today', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 2, title: 'CS Project Submission', type: 'Assignment', date: 'Tomorrow', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 3, title: 'Physics Lab', type: 'Class', date: 'Friday', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 4, title: 'English Literature Exam', type: 'Exam', date: 'Next Monday', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
];

export default function Schedule() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <Link to="/" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition">Back to Home</Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.map((event) => (
            <li key={event.id} className="py-4 flex items-center justify-between">
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-2 ${event.color}`}>{event.type}</span>
                <span className="font-medium text-gray-900 dark:text-white">{event.title}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-300">{event.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
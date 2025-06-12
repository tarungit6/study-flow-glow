import React from 'react';

const events = [
  { id: 1, title: 'Math Assignment #5 Due', type: 'Assignment', date: 'Today', color: 'bg-purple-100 text-purple-800' },
  { id: 2, title: 'CS Project Submission', type: 'Assignment', date: 'Tomorrow', color: 'bg-purple-100 text-purple-800' },
  { id: 3, title: 'Physics Lab', type: 'Class', date: 'Friday', color: 'bg-blue-100 text-blue-800' },
  { id: 4, title: 'English Literature Exam', type: 'Exam', date: 'Next Monday', color: 'bg-red-100 text-red-800' },
];

export default function Schedule() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <ul className="divide-y divide-gray-200">
          {events.map((event) => (
            <li key={event.id} className="py-4 flex items-center justify-between">
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-2 ${event.color}`}>{event.type}</span>
                <span className="font-medium">{event.title}</span>
              </div>
              <span className="text-xs text-gray-500">{event.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
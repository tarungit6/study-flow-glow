import React from 'react';

const courses = [
  {
    id: 1,
    title: 'Advanced Mathematics',
    instructor: 'Dr. Smith',
    progress: 75,
    color: 'bg-blue-100',
    badge: 'Hard',
  },
  {
    id: 2,
    title: 'Computer Science',
    instructor: 'Prof. Johnson',
    progress: 60,
    color: 'bg-purple-100',
    badge: 'Medium',
  },
  {
    id: 3,
    title: 'Physics Fundamentals',
    instructor: 'Dr. Williams',
    progress: 85,
    color: 'bg-green-100',
    badge: 'Hard',
  },
  {
    id: 4,
    title: 'English Literature',
    instructor: 'Ms. Davis',
    progress: 45,
    color: 'bg-pink-100',
    badge: 'Easy',
  },
];

export default function Courses() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className={`rounded-xl shadow p-5 ${course.color} flex flex-col gap-2`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">{course.title}</span>
              <span className={`text-xs px-2 py-1 rounded-full bg-white/80 font-medium ${course.badge === 'Hard' ? 'text-red-600' : course.badge === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{course.badge}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
            <div className="text-xs text-gray-500">Progress: {course.progress}%</div>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Go to Course</button>
          </div>
        ))}
      </div>
    </div>
  );
} 
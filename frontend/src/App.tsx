import { useEffect, useState } from 'react';
import { Course, Lesson } from './types';

const API_BASE_URL = 'http://localhost:4000/api';

export default function App() {
  // State Containers
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Form State Containers
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');

  // UI States
  const [error, setError] = useState<string | null>(null);
  // Add UI states inside your component
    const [_loading, setLoading] = useState(false);

    useEffect(() => {
    const loadDashboardData = async () => {
        setLoading(true);
        try {
        const [coursesRes, lessonsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/courses`),
            fetch(`${API_BASE_URL}/lessons`)
        ]);
        
        if (!coursesRes.ok || !lessonsRes.ok) throw new Error("Database fetch failed");
        
        const coursesData = await coursesRes.json();
        const lessonsData = await lessonsRes.json();
        
        setCourses(coursesData);
        setLessons(lessonsData);
        if (coursesData.length > 0) setSelectedCourseId(coursesData[0].id);
        } catch (err: any) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    loadDashboardData();
    }, []);


  // Helper: Computed dynamic properties for single courses
  const getCourseProgress = (courseId: string) => {
    const courseLessons = lessons.filter(l => l.courseId === courseId);
    if (courseLessons.length === 0) return 0;
    const completed = courseLessons.filter(l => l.isCompleted).length;
    return Math.round((completed / courseLessons.length) * 100); // Progress formula [cite: 14]
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    try {
        const res = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: courseTitle, description: courseDesc })
        });
        
        if (!res.ok) throw new Error("Could not create course");
        const newCourse = await res.json();
        
        setCourses([...courses, newCourse]);
        setSelectedCourseId(newCourse.id);
        setCourseTitle('');
        setCourseDesc('');
    } catch (err: any) {
        setError(err.message);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !lessonTitle.trim()) return;

    try {
        const res = await fetch(`${API_BASE_URL}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            course_id: selectedCourseId, // Match your backend snake_case key if applicable
            title: lessonTitle,
            description: lessonDesc
        })
        });
        
        if (!res.ok) throw new Error("Could not add lesson");
        const newLesson = await res.json();
        
        setLessons([...lessons, newLesson]);
        setLessonTitle('');
        setLessonDesc('');
    } catch (err: any) {
        setError(err.message);
    }
  };

  const toggleLessonCompletion = async (lessonId: string, currentStatus: boolean) => {
    try {
        const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !currentStatus })
        });
        
        if (!res.ok) throw new Error("Status update failed");
        const updatedLesson = await res.json();
        
        setLessons(lessons.map(l => l.id === lessonId ? updatedLesson : l));
    } catch (err: any) {
        setError(err.message);
    }
    };

    const handleDeleteCourse = async (courseId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete course");
            
            setCourses(courses.filter(c => c.id !== courseId));
            setLessons(lessons.filter(l => l.courseId !== courseId));
            if (selectedCourseId === courseId) setSelectedCourseId(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to remove lesson");
            
            setLessons(lessons.filter(l => l.id !== lessonId));
        } catch (err: any) {
            setError(err.message);
        }
    };

  const currentCourse = courses.find(c => c.id === selectedCourseId);
  const currentLessons = lessons.filter(l => l.courseId === selectedCourseId);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">📚 Course Progress Dashboard</h1>
          <p className="text-gray-500 mt-1">Easily configure your curriculum mapping metrics from one central hub.</p>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm flex justify-between items-center">
            <span className="text-sm text-red-700 font-medium">⚠️ Error: {error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR: Course Creator and List */}
          <div className="space-y-6 lg:col-span-1">
            {/* Create Course Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Create New Course</h2>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Course Title *</label>
                  <input 
                    type="text" 
                    value={courseTitle} 
                    onChange={e => setCourseTitle(e.target.value)}
                    placeholder="e.g., Learn FastAPI Basics" 
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Description</label>
                  <textarea 
                    value={courseDesc} 
                    onChange={e => setCourseDesc(e.target.value)}
                    placeholder="Short summary of target skills..." 
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all shadow-sm">
                  Add Course
                </button>
              </form>
            </div>

            {/* Courses Sidebar Navigation List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Courses ({courses.length})</h2>
              {courses.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No courses created yet.</p>
              ) : (
                <div className="space-y-3">
                  {courses.map(course => {
                    const progress = getCourseProgress(course.id);
                    const isSelected = course.id === selectedCourseId;
                    return (
                      <div 
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer relative group ${
                          isSelected ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{course.title}</h3>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.id);
                            }}
                            className="text-gray-400 hover:text-red-600 text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete course"
                          >
                            🗑️
                          </button>
                        </div>
                        {/* Compact Visual Progress Metric */}
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span className="font-medium text-indigo-600">{progress}% Done</span>
                          <span>{lessons.filter(l => l.courseId === course.id).length} lessons</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
                          <div className="bg-indigo-600 h-1 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT VIEW: Focused Course Worksheet Workstation */}
          <div className="lg:col-span-2">
            {currentCourse ? (
              <div className="space-y-6">
                
                {/* Header Profile Area */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{currentCourse.title}</h2>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold">
                      Progress: {getCourseProgress(currentCourse.id)}%
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{currentCourse.description || "No description provided."}</p>
                  
                  {/* Big Progress Bar */}
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200/50">
                    <div 
                      className="bg-emerald-500 h-3 transition-all duration-500 ease-out" 
                      style={{ width: `${getCourseProgress(currentCourse.id)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Grid Framework Split for Lesson Management */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                  
                  {/* Lesson Appender Form */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Add Lesson</h3>
                    <form onSubmit={handleAddLesson} className="space-y-3">
                      <div>
                        <label htmlFor="lessonTitle" className="sr-only">Lesson Title</label>
                        <input 
                          id="lessonTitle"
                          type="text" 
                          value={lessonTitle}
                          onChange={e => setLessonTitle(e.target.value)}
                          placeholder="Lesson Title *" 
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                      <div>
                        <label htmlFor="lessonDesc" className="sr-only">Lesson Description</label>
                        <textarea 
                          id="lessonDesc"
                          value={lessonDesc}
                          onChange={e => setLessonDesc(e.target.value)}
                          placeholder="Quick details (optional)..." 
                          rows={2}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                      <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors">
                        ➕ Add Unit to Course
                      </button>
                    </form>
                  </div>

                  {/* Lessons Listing Registry Container */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 md:col-span-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Lesson Syllabus ({currentLessons.length})</h3>
                    {currentLessons.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-8">This program syllabus configuration is currently empty.</p>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {currentLessons.map(lesson => (
                          <div key={lesson.id} className="py-3 flex items-start justify-between gap-3 group">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={lesson.isCompleted}
                                onChange={() => toggleLessonCompletion(lesson.id, lesson.isCompleted)}
                                aria-label={`Mark ${lesson.title} as completed`}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                              <div>
                                <h4 className={`text-sm font-medium ${lesson.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {lesson.title}
                                </h4>
                                {lesson.description && (
                                  <p className="text-xs text-gray-400 mt-0.5">{lesson.description}</p>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="text-gray-300 hover:text-red-500 text-xs font-semibold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center shadow-inner">
                <span className="text-4xl">🎯</span>
                <h3 className="text-lg font-bold text-gray-700 mt-4">No Course Workspace Active</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto mt-1">
                  Select a syllabus module from the sidebar index panel profile view or generate a clean build to initialize your dashboard layout engine.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
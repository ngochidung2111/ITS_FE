import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward, 
  List, 
  X,
  BookOpen,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import courses, { type Course, type LectureItem } from '../utils/courses';

const VideoLecture = () => {
  const { courseId, lectureId } = useParams<{ courseId: string, lectureId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLecture, setCurrentLecture] = useState<LectureItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'discussions'>('content');
  const [notes, setNotes] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      let lecture: LectureItem | null = null;
      for (const section of foundCourse.curriculum) {
        const found = section.lectures.find(l => l.id === lectureId);
        if (found) {
          lecture = found;
          break;
        }
      }
      
      if (lecture) {
        setCurrentLecture(lecture);
        document.title = `${lecture.title} | ITS`;
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 800);
    const timer = setTimeout(() => {
      setShowCompletionModal(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [courseId, lectureId]);
  
  const getAllLectures = (course: Course): LectureItem[] => {
    return course?.curriculum.flatMap(section => section.lectures) || [];
  };
  
  const getAdjacentLectures = () => {
    if (!course || !currentLecture) return { prev: null, next: null };
    
    const allLectures = getAllLectures(course);
    const currentIndex = allLectures.findIndex(l => l.id === currentLecture.id);
    
    return {
      prev: currentIndex > 0 ? allLectures[currentIndex - 1] : null,
      next: currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null
    };
  };
  
  const { prev, next } = course ? getAdjacentLectures() : { prev: null, next: null };
  
  // Video player controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };
  
  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!isFullscreen) {
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };
  
  const seek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const markAsCompleted = () => {
    setShowCompletionModal(false);

    if (next) {
      navigate(`/lecture/${courseId}/${next.id}`);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 pt-16">
        <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!course || !currentLecture) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 pt-16 px-4">
        <AlertTriangle size={64} className="text-warning-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Lecture Not Found</h1>
        <p className="text-gray-400 mb-6 text-center">
          The lecture you're looking for doesn't exist or has been removed.
        </p>
        <button 
          onClick={() => navigate(`/courses/${courseId}`)}
          className="btn btn-primary flex items-center"
        >
          <ChevronLeft size={18} className="mr-2" />
          Back to Course
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Video Player */}
          <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:mr-80' : ''}`}>
            <div className="relative bg-black" ref={videoContainerRef}>
              {/* Video */}
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[calc(100vh-10rem)]"
                poster={course.imageUrl}
                onTimeUpdate={handleProgress}
                onClick={togglePlay}
              >
                <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                {/* Progress Bar */}
                <div 
                  className="relative h-1 bg-gray-600 rounded-full mb-2 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
                    style={{ width: `${videoProgress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:text-primary-400" onClick={togglePlay}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button className="p-1 hover:text-primary-400" onClick={() => seek(-10)}>
                      <SkipBack size={20} />
                    </button>
                    <button className="p-1 hover:text-primary-400" onClick={() => seek(10)}>
                      <SkipForward size={20} />
                    </button>
                    <button className="p-1 hover:text-primary-400" onClick={toggleMute}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <div className="w-20 hidden sm:block">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm text-gray-300">00:00 / 10:00</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:text-primary-400 lg:hidden" onClick={toggleSidebar}>
                      <List size={20} />
                    </button>
                    <button className="p-1 hover:text-primary-400">
                      <Settings size={20} />
                    </button>
                    <button className="p-1 hover:text-primary-400" onClick={toggleFullscreen}>
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Play/Pause overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: isPlaying ? 0 : 0.8 }}
              >
                <div className="bg-black/50 p-4 rounded-full">
                  <Play size={48} className="text-white" />
                </div>
              </div>
            </div>
            
            {/* Lecture Info */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold">{currentLecture.title}</h1>
                <button 
                  className="md:hidden flex items-center text-primary-400 hover:text-primary-300"
                  onClick={toggleSidebar}
                >
                  <List size={20} className="mr-1" />
                  <span>Contents</span>
                </button>
              </div>
              <p className="text-gray-400">{currentLecture.description}</p>
            </div>
            
            {/* Navigation */}
            <div className="p-4 flex items-center justify-between border-b border-gray-800">
              <Link
                to={prev ? `/lecture/${courseId}/${prev.id}` : `#`}
                className={`flex items-center ${prev ? 'text-primary-400 hover:text-primary-300' : 'text-gray-600 cursor-not-allowed'}`}
                onClick={(e) => !prev && e.preventDefault()}
              >
                <ChevronLeft size={20} className="mr-1" />
                <span>Previous</span>
              </Link>
              
              <Link
                to={`/courses/${courseId}`}
                className="flex items-center text-gray-400 hover:text-white"
              >
                <BookOpen size={20} className="mr-1" />
                <span>Course Page</span>
              </Link>
              
              <Link
                to={next ? `/lecture/${courseId}/${next.id}` : `#`}
                className={`flex items-center ${next ? 'text-primary-400 hover:text-primary-300' : 'text-gray-600 cursor-not-allowed'}`}
                onClick={(e) => !next && e.preventDefault()}
              >
                <span>Next</span>
                <ChevronRight size={20} className="ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Sidebar */}
          <div 
            className={`fixed top-16 right-0 bottom-0 w-full sm:w-80 bg-gray-800 overflow-y-auto transition-transform duration-300 z-20 
            ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:hidden'}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Course Content</h2>
              <button 
                className="lg:hidden p-1 text-gray-400 hover:text-white"
                onClick={toggleSidebar}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${
                  activeTab === 'content' 
                    ? 'text-white border-b-2 border-primary-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('content')}
              >
                <div className="flex items-center justify-center">
                  <BookOpen size={16} className="mr-1" />
                  <span>Contents</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${
                  activeTab === 'notes' 
                    ? 'text-white border-b-2 border-primary-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('notes')}
              >
                <div className="flex items-center justify-center">
                  <FileText size={16} className="mr-1" />
                  <span>Notes</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${
                  activeTab === 'discussions' 
                    ? 'text-white border-b-2 border-primary-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('discussions')}
              >
                <div className="flex items-center justify-center">
                  <MessageSquare size={16} className="mr-1" />
                  <span>Discussions</span>
                </div>
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'content' && (
                <div>
                  {course.curriculum.map((section) => (
                    <div key={section.id} className="mb-4">
                      <h3 className="font-medium mb-2">{section.title}</h3>
                      <div className="space-y-2">
                        {section.lectures.map((lecture) => (
                          <Link
                            key={lecture.id}
                            to={`/lecture/${courseId}/${lecture.id}`}
                            className={`flex items-start p-2 rounded-lg ${
                              lecture.id === currentLecture.id 
                                ? 'bg-primary-900 text-primary-200' 
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <Play size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{lecture.title}</p>
                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                <span>{lecture.duration}</span>
                                {lecture.isFree && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-primary-900 text-primary-300 rounded-sm">
                                    Free
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'notes' && (
                <div>
                  <p className="text-gray-300 mb-4">
                    Take notes for this lecture. Your notes are saved automatically and can be accessed anytime.
                  </p>
                  <textarea
                    className="w-full h-64 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    placeholder="Type your notes here..."
                    value={notes}
                    onChange={handleNoteChange}
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <button className="btn btn-primary text-sm">
                      Save Notes
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'discussions' && (
                <div>
                  <p className="text-gray-300 mb-4">
                    Discuss this lecture with other students and the instructor.
                  </p>
                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 mb-2">
                      No discussions yet for this lecture.
                    </p>
                    <p className="text-gray-400 text-sm">
                      Be the first to start a discussion!
                    </p>
                  </div>
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                      placeholder="Ask a question or share your thoughts..."
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end">
                      <button className="btn btn-primary text-sm">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-success-100 dark:bg-success-900 p-3 rounded-full">
                <CheckCircle size={40} className="text-success-600 dark:text-success-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Lecture Completed!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Great job! You've completed "{currentLecture.title}".
            </p>
            <div className="flex flex-col space-y-3">
              {next ? (
                <button 
                  onClick={() => {
                    setShowCompletionModal(false);
                    navigate(`/lecture/${courseId}/${next.id}`);
                  }}
                  className="btn btn-primary"
                >
                  Continue to Next Lecture
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setShowCompletionModal(false);
                    navigate(`/courses/${courseId}`);
                  }}
                  className="btn btn-primary"
                >
                  Back to Course Page
                </button>
              )}
              <button 
                onClick={() => setShowCompletionModal(false)}
                className="btn btn-outline"
              >
                Stay on This Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLecture;
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainFeature from "../components/MainFeature";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { fetchTasks } from "../services/apperService";

const Home = () => {
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0
  });
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initial data loading
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const tasksData = await fetchTasks();
        
        // Update stats based on fetched tasks
        updateStats(tasksData);
        
        // Hide welcome message if user has tasks
        if (tasksData.length > 0 && showWelcome) {
          setShowWelcome(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load tasks:", error);
        setError("Failed to load your tasks. Please try again later.");
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);
  
  // Update stats when tasks change
  const updateStats = (tasks) => {
    const completed = tasks.filter(task => task.status === "COMPLETED").length;
    const inProgress = tasks.filter(task => task.status === "IN_PROGRESS").length;
    const pending = tasks.filter(task => task.status === "TODO").length;
    
    setStats({ completed, inProgress, pending });
  };
  
  // Handle task updates from MainFeature
  const handleTasksUpdate = (tasks) => {
    updateStats(tasks);
    
    // Hide welcome message once user has tasks
    if (tasks.length > 0 && showWelcome) {
      setShowWelcome(false);
    }
  };
  
  // Dismiss welcome message
  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 card p-6 border-l-4 border-l-primary"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">Welcome to TaskFlow!</h2>
                <p className="text-surface-600 dark:text-surface-300">
                  Get started by adding your first task below. Organize, prioritize, and track your tasks with ease.
                </p>
              </div>
              <button 
                onClick={dismissWelcome}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                aria-label="Dismiss welcome message"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Completed</p>
              <h3 className="text-2xl font-bold">{stats.completed}</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">In Progress</p>
              <h3 className="text-2xl font-bold">{stats.inProgress}</h3>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Pending</p>
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
            </div>
          </div>
        </motion.div>
      </div>
      
      {isLoading ? (
        <div className="card p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="mt-4 text-surface-600 dark:text-surface-300">Loading your tasks...</p>
        </div>
      ) : error ? (
        <div className="card p-8 text-center text-red-500">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : (
        <MainFeature onTasksUpdate={handleTasksUpdate} />
      )}
    </div>
  );
};

export default Home;
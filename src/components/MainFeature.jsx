import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Calendar, 
  Flag, 
  Trash2, 
  Edit3,
  X,
  Save,
  AlertTriangle
} from "lucide-react";

const MainFeature = ({ onTasksUpdate }) => {
  // Task states
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    status: "TODO"
  });
  
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Save tasks to localStorage and update parent component
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    if (onTasksUpdate) {
      onTasksUpdate(tasks);
    }
  }, [tasks, onTasksUpdate]);
  
  // Handle input changes for new task
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!newTask.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (newTask.dueDate && new Date(newTask.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      errors.dueDate = "Due date cannot be in the past";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Add new task
  const addTask = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const task = {
      id: Date.now().toString(),
      ...newTask,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "MEDIUM",
      status: "TODO"
    });
    setShowForm(false);
    setFormErrors({});
  };
  
  // Delete task
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  // Update task status
  const updateTaskStatus = (id, status) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, status, updatedAt: new Date().toISOString() } 
          : task
      )
    );
  };
  
  // Start editing task
  const startEditTask = (task) => {
    setEditingTask({ ...task });
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
  };
  
  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask.title.trim()) {
      return;
    }
    
    setTasks(prev => 
      prev.map(task => 
        task.id === editingTask.id 
          ? { ...editingTask, updatedAt: new Date().toISOString() } 
          : task
      )
    );
    
    setEditingTask(null);
  };
  
  // Handle input changes for editing task
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === "ALL") return true;
    return task.status === filter;
  });
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="text-green-500" size={18} />;
      case "IN_PROGRESS":
        return <Clock className="text-blue-500" size={18} />;
      default:
        return <Circle className="text-gray-400" size={18} />;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "HIGH":
        return <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">High</span>;
      case "MEDIUM":
        return <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Medium</span>;
      case "LOW":
        return <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Low</span>;
      default:
        return null;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };
  
  // Check if date is past due
  const isPastDue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700">
            <button 
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 text-sm ${filter === "ALL" 
                ? "bg-primary text-white" 
                : "bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("TODO")}
              className={`px-3 py-1.5 text-sm ${filter === "TODO" 
                ? "bg-primary text-white" 
                : "bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700"}`}
            >
              To Do
            </button>
            <button 
              onClick={() => setFilter("IN_PROGRESS")}
              className={`px-3 py-1.5 text-sm ${filter === "IN_PROGRESS" 
                ? "bg-primary text-white" 
                : "bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700"}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setFilter("COMPLETED")}
              className={`px-3 py-1.5 text-sm ${filter === "COMPLETED" 
                ? "bg-primary text-white" 
                : "bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700"}`}
            >
              Completed
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancel" : "Add Task"}
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
              
              <form onSubmit={addTask} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className={`input ${formErrors.title ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="Enter task title"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle size={14} />
                      {formErrors.title}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="input"
                    placeholder="Enter task description"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={newTask.dueDate}
                        onChange={handleInputChange}
                        className={`input pl-10 ${formErrors.dueDate ? "border-red-500 focus:ring-red-500" : ""}`}
                      />
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    </div>
                    {formErrors.dueDate && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertTriangle size={14} />
                        {formErrors.dueDate}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        id="priority"
                        name="priority"
                        value={newTask.priority}
                        onChange={handleInputChange}
                        className="input pl-10 appearance-none"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                      <Flag size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn-primary"
                  >
                    <Plus size={18} />
                    Create Task
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {filteredTasks.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
            <AlertTriangle size={24} className="text-surface-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            {filter === "ALL" 
              ? "You haven't created any tasks yet." 
              : `You don't have any ${filter.toLowerCase().replace('_', ' ')} tasks.`}
          </p>
          {filter !== "ALL" && (
            <button 
              onClick={() => setFilter("ALL")}
              className="btn-outline"
            >
              View all tasks
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                layout
                className={`card p-4 ${
                  task.status === "COMPLETED" 
                    ? "border-l-4 border-l-green-500" 
                    : task.status === "IN_PROGRESS" 
                    ? "border-l-4 border-l-blue-500" 
                    : "border-l-4 border-l-gray-300 dark:border-l-gray-600"
                }`}
              >
                {editingTask && editingTask.id === task.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={handleEditChange}
                      className="input font-medium"
                    />
                    
                    <textarea
                      name="description"
                      value={editingTask.description}
                      onChange={handleEditChange}
                      rows="2"
                      className="input text-sm"
                    ></textarea>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="relative">
                          <input
                            type="date"
                            name="dueDate"
                            value={editingTask.dueDate}
                            onChange={handleEditChange}
                            className="input pl-10 text-sm"
                          />
                          <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="relative">
                          <select
                            name="priority"
                            value={editingTask.priority}
                            onChange={handleEditChange}
                            className="input pl-10 text-sm appearance-none"
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                          </select>
                          <Flag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="btn-outline text-sm px-3 py-1.5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEditedTask}
                        className="btn-primary text-sm px-3 py-1.5"
                      >
                        <Save size={16} />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => {
                            const nextStatus = {
                              "TODO": "IN_PROGRESS",
                              "IN_PROGRESS": "COMPLETED",
                              "COMPLETED": "TODO"
                            }[task.status];
                            updateTaskStatus(task.id, nextStatus);
                          }}
                          className="mt-1 hover:scale-110 transition-transform"
                        >
                          {getStatusIcon(task.status)}
                        </button>
                        
                        <div>
                          <h3 className={`font-medium ${
                            task.status === "COMPLETED" ? "line-through text-surface-400" : ""
                          }`}>
                            {task.title}
                          </h3>
                          
                          {task.description && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {task.dueDate && (
                              <span className={`text-xs flex items-center gap-1 ${
                                isPastDue(task.dueDate) && task.status !== "COMPLETED"
                                  ? "text-red-500"
                                  : "text-surface-500 dark:text-surface-400"
                              }`}>
                                <Calendar size={14} />
                                {formatDate(task.dueDate)}
                                {isPastDue(task.dueDate) && task.status !== "COMPLETED" && " (Overdue)"}
                              </span>
                            )}
                            
                            {getPriorityBadge(task.priority)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditTask(task)}
                          className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
                          aria-label="Edit task"
                        >
                          <Edit3 size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-surface-500 hover:text-red-600 dark:text-surface-400 dark:hover:text-red-400 transition-colors"
                          aria-label="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MainFeature;
// Initialize the ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient("2lnrdYdZQDo5Ys5LY6wm");
};

// Task-related operations
export const fetchTasks = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('Tasks', {
      fields: ['id', 'title', 'description', 'dueDate', 'priority', 'status', 'createdAt', 'updatedAt'],
      orderBy: [{ field: "updatedAt", direction: "desc" }],
    });
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord('Tasks', {
      record: {
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const apperClient = getApperClient();
    
    const response = await apperClient.updateRecord('Tasks', taskId, {
      record: {
        ...taskData,
        updatedAt: new Date().toISOString()
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord('Tasks', taskId);
    
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, User } from '../types';
import { api } from '../services/api';

interface TaskState {
  tasks: Task[];
  users: User[];
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'FETCH_TASKS_START' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_ERROR'; payload: string }
  | { type: 'FETCH_USERS_SUCCESS'; payload: User[] }
  | { type: 'CREATE_TASK_SUCCESS'; payload: Task }
  | { type: 'UPDATE_TASK_SUCCESS'; payload: Task }
  | { type: 'ADD_COMMENT_SUCCESS'; payload: Task }
  | { type: 'DELETE_TASK_SUCCESS'; payload: string };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_TASKS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_TASKS_SUCCESS':
      return { ...state, loading: false, tasks: action.payload };
    case 'FETCH_TASKS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, users: action.payload };
    case 'CREATE_TASK_SUCCESS':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'ADD_COMMENT_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    default:
      return state;
  }
};

interface TaskContextType {
  state: TaskState;
  fetchTasks: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'history' | 'comments' | 'status'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task | undefined>;
  addComment: (taskId: string, userId: string, text: string) => Promise<Task | undefined>;
  deleteTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    users: [],
    loading: false,
    error: null,
  });

  const fetchTasks = async () => {
    try {
      dispatch({ type: 'FETCH_TASKS_START' });
      const tasks = await api.getTasks();
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: tasks });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_TASKS_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch tasks' 
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await api.getUsers();
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: users });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'history' | 'comments' | 'status'>): Promise<Task> => {
    try {
      const newTask = await api.createTask(taskData);
      dispatch({ type: 'CREATE_TASK_SUCCESS', payload: newTask });
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task | undefined> => {
    try {
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : '';
      const updatedTask = await api.updateTask(taskId, updates, userId);
      if (updatedTask) {
        dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: updatedTask });
        return updatedTask;
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const addComment = async (taskId: string, userId: string, text: string): Promise<Task | undefined> => {
    try {
      const updatedTask = await api.addCommentToTask(taskId, userId, text);
      if (updatedTask) {
        dispatch({ type: 'ADD_COMMENT_SUCCESS', payload: updatedTask });
        return updatedTask;
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // In the current API, we don't have a delete function, so we'll simulate it
      // by updating the task status to something like "Archived" or filtering it out
      dispatch({ type: 'DELETE_TASK_SUCCESS', payload: taskId });
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        fetchTasks,
        fetchUsers,
        createTask,
        updateTask,
        addComment,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

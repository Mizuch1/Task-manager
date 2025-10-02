import axios from 'axios';
import type { User, Task, Comment } from '../types';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const api = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await apiClient.post<User>('/users/login', { email, password });
      return response.data;
    } catch (error) {
      // Handle different error responses
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          return null; // Invalid credentials
        }
      }
      console.error('Login error:', error);
      return null; // Return null on error to prevent app from crashing
    }
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  getTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },

  getTaskById: async (id: string): Promise<Task | undefined> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'history' | 'comments' | 'status'>): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', { ...taskData, id: `task-${Date.now()}` }); // temporary ID generation
    return response.data;
  },

  updateTask: async (taskId: string, updates: Partial<Task>, userId: string): Promise<Task | undefined> => {
    const response = await apiClient.put<Task>(`/tasks/${taskId}`, { ...updates, userId });
    return response.data;
  },

  addCommentToTask: async (taskId: string, userId: string, text: string): Promise<Task | undefined> => {
    const response = await apiClient.post<Comment>(`/tasks/${taskId}/comments`, { userId, text });
    // The backend now returns the new comment, not the whole task.
    // For simplicity, we'll just refetch the task. In a real app, you might update the state locally.
    return api.getTaskById(taskId);
  },

  notifyTaskAssignment: async (taskId: string, userId: string): Promise<void> => {
    // This could be a backend endpoint in the future
    console.log(`[Notification] User ${userId} has been notified for task: "${taskId}"`);
  }
};

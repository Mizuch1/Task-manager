import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import TaskDetail from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import MyTasks from './pages/MyTasks';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
 return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <ToastProvider>
            <HashRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="departements" element={<Departments />} />
                  <Route path="taches" element={<MyTasks />} />
                  <Route path="taches/creer" element={<CreateTask />} />
                  <Route path="taches/:id" element={<TaskDetail />} />
                  <Route path="profil" element={<Profile />} />
                  <Route path="parametres" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </ToastProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

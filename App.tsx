import React from 'react';
// FIX: Using namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
        <ReactRouterDOM.HashRouter>
          <ReactRouterDOM.Routes>
            <ReactRouterDOM.Route path="/login" element={<Login />} />
            <ReactRouterDOM.Route 
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="/dashboard" replace />} />
              <ReactRouterDOM.Route path="dashboard" element={<Dashboard />} />
              <ReactRouterDOM.Route path="departements" element={<Departments />} />
              <ReactRouterDOM.Route path="taches" element={<MyTasks />} />
              <ReactRouterDOM.Route path="taches/creer" element={<CreateTask />} />
              <ReactRouterDOM.Route path="taches/:id" element={<TaskDetail />} />
              <ReactRouterDOM.Route path="profil" element={<Profile />} />
              <ReactRouterDOM.Route path="parametres" element={<Settings />} />
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route path="*" element={<NotFound />} />
          </ReactRouterDOM.Routes>
        </ReactRouterDOM.HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b bg-white dark:bg-slate-800 dark:border-slate-700 px-4 sm:px-6">
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1">
        {/* Can add search bar or breadcrumbs here if needed */}
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <ThemeSwitcher />
        {/* Notifications */}
        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            className="relative rounded-full p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500 justify-center items-center text-white text-[8px]">2</span>
            </span>
          </button>
          {notificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-slate-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-4 border-b dark:border-slate-600">
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Notifications</h3>
              </div>
              <div className="py-1">
                <a href="#" className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">
                  <p className="font-medium text-slate-800 dark:text-slate-200">Rapport mensuel disponible</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Le rapport de performance de septembre est prêt à être consulté.</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Il y a 2 heures</p>
                </a>
                <a href="#" className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">
                  <p className="font-medium text-slate-800 dark:text-slate-200">Objectif atteint</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Le département Qualité a dépassé son objectif mensuel.</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Il y a 4 heures</p>
                </a>
              </div>
               <div className="p-2 border-t dark:border-slate-600">
                  <a href="#" className="block text-center text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                    Voir toutes les notifications
                  </a>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <img className="h-8 w-8 rounded-full" src={user?.avatarUrl} alt="" />
            <div className="text-left hidden sm:block">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</div>
            </div>
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Link to="/profil" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">
                <User className="mr-2 h-4 w-4" /> Profil
              </Link>
              <Link to="/parametres" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">
                <Settings className="mr-2 h-4 w-4" /> Paramètres
              </Link>
               <a href="#" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600">
                <HelpCircle className="mr-2 h-4 w-4" /> Aide
              </a>
              <div className="border-t my-1 dark:border-slate-600"></div>
              <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
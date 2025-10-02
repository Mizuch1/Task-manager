import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-4">Page non trouvée</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2">Désolé, la page que vous recherchez n'existe pas.</p>
      <Link
        to="/dashboard"
        className="mt-6 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700 transition duration-300"
      >
        Retourner au tableau de bord
      </Link>
    </div>
  );
};

export default NotFound;
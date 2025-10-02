import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="dark:text-slate-200">Utilisateur non trouvé.</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex items-center space-x-6">
        <img className="h-24 w-24 rounded-full object-cover" src={user.avatarUrl} alt="Profil" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{user.firstName} {user.lastName}</h1>
          <p className="text-slate-500 dark:text-slate-400">{user.role}</p>
        </div>
      </div>
      <div className="mt-8 border-t dark:border-slate-700 pt-6">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Informations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Email</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{user.email}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Département</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{user.department}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Téléphone</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{user.phone || 'Non spécifié'}</p>
          </div>
           <div>
            <p className="text-slate-500 dark:text-slate-400">ID Utilisateur</p>
            <p className="font-medium text-slate-800 dark:text-slate-200">{user.id}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t dark:border-slate-700 flex justify-end">
          <button
              onClick={() => alert('La modification du profil n\'est pas encore disponible.')}
              className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700 transition duration-300"
          >
              Modifier le Profil
          </button>
      </div>
    </div>
  );
};

export default Profile;
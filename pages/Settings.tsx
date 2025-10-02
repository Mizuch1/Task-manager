import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Monitor, Lock, Download, Trash2 } from 'lucide-react';
import { cn } from '../utils';

const ToggleSwitch = ({ id, checked, onChange, label, description }: { id: string, checked: boolean, onChange: (checked: boolean) => void, label: string, description?: string }) => (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer py-2">
        <div className="flex-grow pr-4">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
            {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        <div className="relative">
            <input id={id} type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className="w-10 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-primary-600"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
        </div>
    </label>
);

const Settings = () => {
    const { preference, setPreference } = useTheme();
    
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        summary: 'Quotidien',
    });

    const handleNotificationChange = (key: keyof typeof notifications, value: boolean | string) => {
        setNotifications(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Paramètres</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Gérez vos préférences de compte et d'application.</p>
            </div>
            
            <div className="space-y-10 max-w-3xl">
                {/* Apparence Section */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">Apparence</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Personnalisez l'apparence de l'application.</p>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border dark:border-slate-700">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Thème</span>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button onClick={() => setPreference('light')} className={cn('p-4 border rounded-lg text-center transition-colors', preference === 'light' ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500')}>
                                <Sun className="w-6 h-6 mx-auto mb-2 text-slate-600 dark:text-slate-300"/>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Clair</span>
                            </button>
                             <button onClick={() => setPreference('dark')} className={cn('p-4 border rounded-lg text-center transition-colors', preference === 'dark' ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500')}>
                                <Moon className="w-6 h-6 mx-auto mb-2 text-slate-600 dark:text-slate-300"/>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Sombre</span>
                            </button>
                            <button onClick={() => setPreference('system')} className={cn('p-4 border rounded-lg text-center transition-colors', preference === 'system' ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500')}>
                                <Monitor className="w-6 h-6 mx-auto mb-2 text-slate-600 dark:text-slate-300"/>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Système</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">Notifications</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choisissez comment vous souhaitez être notifié.</p>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border dark:border-slate-700 divide-y dark:divide-slate-700">
                        <ToggleSwitch
                            id="email-notifications"
                            label="Notifications par e-mail"
                            description="Recevez des e-mails pour les nouvelles tâches et les mentions."
                            checked={notifications.email}
                            onChange={(value) => handleNotificationChange('email', value)}
                        />
                         <ToggleSwitch
                            id="push-notifications"
                            label="Notifications push"
                            description="Recevez des notifications push (bientôt disponible)."
                            checked={notifications.push}
                            onChange={(value) => alert("Fonctionnalité non implémentée.")}
                        />
                        <div className="flex items-center justify-between py-2">
                            <div className="pr-4">
                                <label htmlFor="summary-frequency" className="block text-sm font-medium text-slate-800 dark:text-slate-200">Fréquence des résumés</label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Recevez un résumé de vos activités.</p>
                            </div>
                            <select
                                id="summary-frequency"
                                value={notifications.summary}
                                onChange={(e) => handleNotificationChange('summary', e.target.value)}
                                className="w-full max-w-[180px] p-2 border dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            >
                                <option>Jamais</option>
                                <option>Quotidien</option>
                                <option>Hebdomadaire</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Account Section */}
                <section>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">Compte</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Gérez les informations de votre compte.</p>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border dark:border-slate-700 space-y-4">
                        <button className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 w-full text-left">
                            <Lock className="w-4 h-4 mr-3" /> Changer le mot de passe
                        </button>
                         <button className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 w-full text-left">
                            <Download className="w-4 h-4 mr-3" /> Exporter mes données
                        </button>
                        <div className="border-t dark:border-slate-700 pt-4">
                            <button className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 w-full text-left">
                                <Trash2 className="w-4 h-4 mr-3" /> Supprimer mon compte
                            </button>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-7">Cette action est irréversible.</p>
                        </div>
                     </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;

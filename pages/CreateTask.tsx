import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ClipboardList, Shield, Activity, GraduationCap, Briefcase, Sparkles, User, Settings } from 'lucide-react';
// FIX: Using namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { cn, formatDate } from '../utils';
import { ALL_DEPARTMENTS, ALL_CATEGORIES, ALL_PRIORITIES } from '../constants';
import { api } from '../services/api';
import type { User as UserType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Priority, Department, Category } from '../types';

const steps = [
    { id: '1', name: 'Modèle', status: 'current' },
    { id: '2', name: 'Détails', status: 'upcoming' },
    { id: '3', name: 'Aperçu', status: 'upcoming' },
];

const TaskTemplateCard = ({ icon: Icon, title, description, category, duration, onSelect }: { icon: React.ElementType, title: string, description: string, category: string, duration: string, onSelect: () => void }) => (
    <div onClick={onSelect} className="border dark:border-slate-700 rounded-lg p-4 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md cursor-pointer transition-all duration-200 bg-white dark:bg-slate-800">
        <div className="flex items-start space-x-4">
            <div className="bg-primary-50 text-primary-600 dark:bg-slate-700 dark:text-primary-400 p-2 rounded-lg">
                <Icon className="w-6 h-6"/>
            </div>
            <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span>{category}</span>
                    <span>{duration}</span>
                </div>
            </div>
        </div>
    </div>
);


const CreateTask = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [users, setUsers] = useState<UserType[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const navigate = ReactRouterDOM.useNavigate();
    const { user: currentUser } = useAuth();
    
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: Priority.Normale,
        dueDate: '',
        assignedTo: [] as string[],
        department: Department.Production,
        category: Category.Production,
    });


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await api.getUsers();
                setUsers(usersData);
                if (usersData.length > 0) {
                    // Pre-select the first user
                    setTaskData(prev => ({ ...prev, assignedTo: [usersData[0].id] }));
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleSelectTemplate = (templateTitle: string, category: Category) => {
        setTaskData(prev => ({...prev, title: templateTitle, category}));
        setCurrentStep(2);
    };
    
    const handleNext = () => {
        if (currentStep === 2) {
            if (!taskData.title || !taskData.description || !taskData.dueDate || taskData.assignedTo.length === 0) {
                 alert("Veuillez remplir tous les champs obligatoires (*).");
                 return;
            }
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    }
    const handleBack = () => {
         if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'assignedTo') {
             setTaskData(prev => ({ ...prev, assignedTo: [value] }));
        } else {
             setTaskData(prev => ({ ...prev, [name]: value as Priority | Department | Category }));
        }
    }

    const handleSubmit = async () => {
        if (!currentUser) {
            alert("Vous devez être connecté pour créer une tâche.");
            return;
        }
        setSubmitting(true);
        try {
            const taskToCreate = {
                ...taskData,
                createdBy: currentUser.id,
            };
            await api.createTask(taskToCreate as any); // API expects Omit<...>
            alert('Tâche créée avec succès !');
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to create task:", error);
            alert("Une erreur est survenue lors de la création de la tâche.");
            setSubmitting(false);
        }
    };

    const getAssignedUserName = () => {
        if (taskData.assignedTo.length === 0) return 'N/A';
        const user = users.find(u => u.id === taskData.assignedTo[0]);
        return user ? `${user.firstName} ${user.lastName}` : 'N/A';
    }


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Tableau de bord / Création de tâche</p>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">Créer une nouvelle tâche</h1>
                </div>
                <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                </button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow">
                 <nav aria-label="Progress" className="mb-8">
                    <ol role="list" className="flex items-center justify-center">
                        {steps.map((step, stepIdx) => (
                        <li key={step.name} className={cn('relative', stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '')}>
                             {(stepIdx + 1 < currentStep) ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-primary-600" />
                                </div>
                                <a href="#" className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 hover:bg-primary-900">
                                <Check className="h-5 w-5 text-white" aria-hidden="true" />
                                <span className="sr-only">{step.name}</span>
                                </a>
                            </>
                            ) : stepIdx + 1 === currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-gray-200 dark:bg-slate-700" />
                                </div>
                                <a href="#" className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white dark:bg-slate-800" aria-current="step">
                                <span className="h-2.5 w-2.5 rounded-full bg-primary-600" aria-hidden="true" />
                                <span className="sr-only">{step.name}</span>
                                </a>
                            </>
                            ) : (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="h-0.5 w-full bg-gray-200 dark:bg-slate-700" />
                                </div>
                                <a href="#" className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-500">
                                <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-slate-600" aria-hidden="true" />
                                <span className="sr-only">{step.name}</span>
                                </a>
                            </>
                            )}
                        </li>
                        ))}
                    </ol>
                </nav>

                {currentStep === 1 && (
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Modèles de tâches</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Sélectionnez un modèle pour créer rapidement une tâche avec des informations pré-remplies.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <TaskTemplateCard icon={Settings} title="Maintenance Préventive" description="Modèle pour les tâches de maintenance préventive..." category="Maintenance" duration="2-4 heures" onSelect={() => handleSelectTemplate('Maintenance Préventive', Category.Maintenance)} />
                             <TaskTemplateCard icon={Check} title="Contrôle Qualité" description="Modèle pour les contrôles qualité et tests de conformité" category="Qualité" duration="1-2 heures" onSelect={() => handleSelectTemplate('Contrôle Qualité', Category.Qualite)} />
                             <TaskTemplateCard icon={Shield} title="Inspection Sécurité" description="Modèle pour les inspections de sécurité et conformité" category="Sécurité" duration="1-3 heures" onSelect={() => handleSelectTemplate('Inspection Sécurité', Category.Securite)} />
                             <TaskTemplateCard icon={Sparkles} title="Nettoyage Équipement" description="Modèle pour le nettoyage et l'entretien des équipements" category="Maintenance" duration="1-2 heures" onSelect={() => handleSelectTemplate('Nettoyage Équipement', Category.Maintenance)} />
                             <TaskTemplateCard icon={Briefcase} title="Tâche Production" description="Modèle pour les tâches de production standard" category="Production" duration="4-8 heures" onSelect={() => handleSelectTemplate('Tâche Production', Category.Production)} />
                             <TaskTemplateCard icon={GraduationCap} title="Formation Personnel" description="Modèle pour les sessions de formation du personnel" category="Autre" duration="2-4 heures" onSelect={() => handleSelectTemplate('Formation Personnel', Category.Autre)} />
                        </div>
                        <div className="mt-8 text-center">
                            <button onClick={() => handleSelectTemplate('Tâche personnalisée', Category.Autre)} className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Ou créer une tâche personnalisée</button>
                        </div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">Remplissez les informations détaillées de la tâche</h2>
                        <div className="space-y-6">
                            <div className="p-4 border dark:border-slate-700 rounded-lg">
                                <h3 className="font-medium mb-4 dark:text-slate-200">Informations de base</h3>
                                <div className="space-y-4">
                                     <div><label className="text-sm dark:text-slate-300">Titre de la tâche *</label><input name="title" value={taskData.title} onChange={handleInputChange} type="text" className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" /></div>
                                     <div><label className="text-sm dark:text-slate-300">Description *</label><textarea name="description" value={taskData.description} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" rows={3}></textarea></div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-sm dark:text-slate-300">Priorité *</label><select name="priority" value={taskData.priority} onChange={handleSelectChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">
                                            {ALL_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select></div>
                                        <div><label className="text-sm dark:text-slate-300">Date d'échéance *</label><input name="dueDate" value={taskData.dueDate} onChange={handleInputChange} type="date" className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" /></div>
                                     </div>
                                </div>
                            </div>
                            <div className="p-4 border dark:border-slate-700 rounded-lg">
                                <h3 className="font-medium mb-4 dark:text-slate-200">Attribution et catégorisation</h3>
                                <div className="grid grid-cols-2 gap-4">
                                     <div><label className="text-sm dark:text-slate-300">Assignés *</label><select name="assignedTo" value={taskData.assignedTo[0]} onChange={handleSelectChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">
                                        {users.map(user => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>)}
                                     </select></div>
                                     <div><label className="text-sm dark:text-slate-300">Département *</label><select name="department" value={taskData.department} onChange={handleSelectChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">
                                        {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                     </select></div>
                                     <div><label className="text-sm dark:text-slate-300">Catégorie *</label><select name="category" value={taskData.category} onChange={handleSelectChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">
                                        {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                     </select></div>
                                </div>
                            </div>
                        </div>
                         <div className="flex justify-end space-x-2 mt-8">
                            <button onClick={handleBack} className="text-slate-600 dark:text-slate-300 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">Retour</button>
                            <button onClick={handleNext} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700">Continuer</button>
                        </div>
                    </div>
                )}
                 {currentStep === 3 && (
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">Aperçu de la Tâche</h2>
                        <div className="space-y-4 border dark:border-slate-700 p-4 rounded-lg">
                            <div><p className="text-sm text-slate-500 dark:text-slate-400">Titre</p><p className="font-semibold dark:text-slate-200">{taskData.title}</p></div>
                            <div className="dark:text-slate-300"><p className="text-sm text-slate-500 dark:text-slate-400">Description</p><p>{taskData.description}</p></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-slate-500 dark:text-slate-400">Assigné à</p><p className="font-semibold dark:text-slate-200">{getAssignedUserName()}</p></div>
                                <div><p className="text-sm text-slate-500 dark:text-slate-400">Date d'échéance</p><p className="font-semibold dark:text-slate-200">{formatDate(taskData.dueDate.toString())}</p></div>
                                <div><p className="text-sm text-slate-500 dark:text-slate-400">Priorité</p><p className="font-semibold dark:text-slate-200">{taskData.priority}</p></div>
                                <div><p className="text-sm text-slate-500 dark:text-slate-400">Département</p><p className="font-semibold dark:text-slate-200">{taskData.department}</p></div>
                                <div><p className="text-sm text-slate-500 dark:text-slate-400">Catégorie</p><p className="font-semibold dark:text-slate-200">{taskData.category}</p></div>
                            </div>
                        </div>
                         <div className="flex justify-end space-x-2 mt-8">
                             <button onClick={handleBack} className="text-slate-600 dark:text-slate-300 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">Retour</button>
                            <button onClick={handleSubmit} disabled={submitting} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700 disabled:bg-primary-300">
                                {submitting ? 'Création...' : 'Confirmer et Créer'}
                            </button>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default CreateTask;
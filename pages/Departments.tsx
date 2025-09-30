import React, { useState, useEffect, useMemo } from 'react';
// FIX: Using namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { api } from '../services/api';
import type { Task, User } from '../types';
import { Department, Priority, Status } from '../types';
import { cn, formatDate } from '../utils';
import { Plus, Upload, MoreVertical, Search, Filter, Clock, CheckCircle, User as UserIcon, AlertTriangle, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
// FIX: Removed 'Donut' from import as it is not an exported member of 'recharts'. The donut chart effect is achieved using PieChart with innerRadius.
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';


const departmentTabs = Object.values(Department);

const subTabs = [
    { id: 'tasks', label: 'Gestion des Tâches' },
    { id: 'metrics', label: 'Métriques' },
    { id: 'team', label: 'Équipe' },
    { id: 'validation', label: 'Validation' }
];

const priorityColors: Record<Priority, string> = {
  [Priority.Haute]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  [Priority.Normale]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  [Priority.Basse]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

const statusColors: Record<Status, string> = {
  [Status.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  [Status.PendingValidation]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  [Status.Todo]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  [Status.Done]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  [Status.Delayed]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const TaskItem = ({ task, user }: { task: Task, user: User | undefined }) => {
    const navigate = ReactRouterDOM.useNavigate();
    return (
        <div onClick={() => navigate(`/taches/${task.id}`)} className="bg-white dark:bg-slate-800 p-4 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        {task.priority === Priority.Haute && <AlertTriangle className="w-4 h-4 text-red-500"/>}
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {user ? `${user.firstName} ${user.lastName}` : 'Non assigné'} 
                        <span className="mx-1">·</span> {formatDate(task.dueDate)} 
                        <span className="mx-1">·</span> {task.department} 
                        <span className="mx-1">·</span> {task.category}
                    </p>
                    <div className="flex items-center space-x-2">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', statusColors[task.status])}>
                            {task.status}
                        </span>
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', priorityColors[task.priority])}>
                            {task.priority}
                        </span>
                        {(task.beforeImageUrl || task.afterImageUrl) && 
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300">Photos</span>
                        }
                    </div>
                </div>
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"><MoreVertical className="w-5 h-5"/></button>
            </div>
        </div>
    );
};

interface TasksViewProps {
    tasks: Task[];
    users: User[];
    sortBy: string;
    setSortBy: (value: string) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (value: 'asc' | 'desc') => void;
}

const TasksView = ({ tasks, users, sortBy, setSortBy, sortOrder, setSortOrder }: TasksViewProps) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                 <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                        <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg w-64 bg-white dark:bg-slate-700 dark:text-slate-200" />
                    </div>
                     <button className="flex items-center space-x-1 px-4 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <span>Tous les statuts</span>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                    </button>
                    <button className="flex items-center space-x-1 px-4 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <span>Toutes priorités</span>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
                 <div className="flex items-center space-x-2">
                    <label htmlFor="sort-dept" className="text-sm font-medium text-slate-600 dark:text-slate-300">Trier par :</label>
                    <select
                        id="sort-dept"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-2 border dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-200"
                    >
                        <option value="createdAt">Date de création</option>
                        <option value="dueDate">Date d'échéance</option>
                        <option value="priority">Priorité</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        aria-label={`Trier par ordre ${sortOrder === 'asc' ? 'décroissant' : 'croissant'}`}
                    >
                        {sortOrder === 'asc' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                    </button>
                 </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                <div className="p-4 border-b dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                    {tasks.length} tâche(s) affichée(s)
                </div>
                {tasks.map(task => {
                    const assignedUser = users.find(u => u.id === task.assignedTo[0]);
                    return <TaskItem key={task.id} task={task} user={assignedUser} />
                })}
            </div>
        </div>
    )
};


const MetricsView = ({ tasks }: { tasks: Task[] }) => {
     const metricStats = useMemo(() => {
        if (!tasks.length) return { terminated: 0, delayed: 0, completionRate: 0, workload: 0 };
        const terminated = tasks.filter(t => t.status === Status.Done).length;
        const delayed = tasks.filter(t => t.status === Status.Delayed).length;
        const completionRate = tasks.length > 0 ? Math.round((terminated / tasks.length) * 100) : 0;
        return { terminated, delayed, completionRate, workload: 78 }; // Dummy workload
    }, [tasks]);

    const completionTrendData = [
        { name: 'Lun', value: 12 }, { name: 'Mar', value: 8 }, { name: 'Mer', value: 15 },
        { name: 'Jeu', value: 10 }, { name: 'Ven', value: 18 }, { name: 'Sam', value: 4 }, { name: 'Dim', value: 7 },
    ];
    
    const priorityData = useMemo(() => {
        return [
            { name: 'Haute', value: tasks.filter(t => t.priority === Priority.Haute).length },
            { name: 'Normale', value: tasks.filter(t => t.priority === Priority.Normale).length },
            { name: 'Basse', value: tasks.filter(t => t.priority === Priority.Basse).length },
        ];
    }, [tasks]);
    const COLORS = ['#EF4444', '#F97316', '#22C55E'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"><p className="text-sm text-slate-500 dark:text-slate-400">Tâches Terminées</p><p className="text-2xl font-bold dark:text-slate-200">{metricStats.terminated}</p></div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"><p className="text-sm text-slate-500 dark:text-slate-400">En Retard</p><p className="text-2xl font-bold dark:text-slate-200">{metricStats.delayed}</p></div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"><p className="text-sm text-slate-500 dark:text-slate-400">Taux de Complétion</p><p className="text-2xl font-bold dark:text-slate-200">{metricStats.completionRate}%</p></div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"><p className="text-sm text-slate-500 dark:text-slate-400">Charge de Travail</p><p className="text-2xl font-bold dark:text-slate-200">{metricStats.workload}%</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Tendances de Complétion</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={completionTrendData}>
                            <XAxis dataKey="name" fontSize={12} tick={{ fill: '#94a3b8' }} />
                            <YAxis fontSize={12} tick={{ fill: '#94a3b8' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Tâches par Priorité</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.1)"/>
                            <XAxis type="number" hide />
                            <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={80} 
                                tickLine={false} 
                                axisLine={false} 
                                fontSize={12} 
                                tick={{ fill: '#94a3b8' }} 
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                            />
                            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                                {priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


const TeamView = ({ users }: { users: User[] }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Hiérarchie de l'Équipe</h3>
        <div className="space-y-4">
            {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 border dark:border-slate-700 rounded-lg">
                    <div className="flex items-center">
                        <img src={user.avatarUrl} alt={user.firstName} className="w-10 h-10 rounded-full mr-4" />
                        <div>
                            <p className="font-semibold dark:text-slate-200">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.phone}</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-6">
                        <div className="text-center">
                            <p className="font-bold text-slate-800 dark:text-slate-200">12</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tâches</p>
                        </div>
                         <div className="text-center">
                            <p className="font-bold text-green-600 dark:text-green-400">10</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Terminées</p>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Disponible</span>
                        <button className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"><MoreVertical className="w-5 h-5"/></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ValidationView = ({ tasks, users }: { tasks: Task[], users: User[] }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-6 h-6 text-orange-500" />
            <div>
                 <h3 className="font-semibold text-slate-800 dark:text-slate-200">File d'Attente de Validation</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400">{tasks.length} tâche(s) en attente de validation</p>
            </div>
        </div>
        <div className="space-y-4">
            {tasks.map(task => {
                const assignedUser = users.find(u => u.id === task.assignedTo[0]);
                return (
                    <div key={task.id} className="p-4 border dark:border-slate-700 rounded-lg">
                        <div className="flex justify-between items-start">
                             <div className="flex items-center">
                                <img src={assignedUser?.avatarUrl} alt={assignedUser?.firstName} className="w-10 h-10 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-semibold dark:text-slate-200">{task.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Soumis par: {assignedUser?.firstName} {assignedUser?.lastName} <span className="mx-1">·</span> {task.department} <span className="mx-1">·</span> <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', priorityColors[task.priority])}>{task.priority}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="text-sm font-medium text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">Rejeter</button>
                                <button className="text-sm font-medium text-white bg-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700">Valider</button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const Departments = () => {
    const [activeDept, setActiveDept] = useState<string>('Tous les Départements');
    const [activeSubTab, setActiveSubTab] = useState<string>('tasks');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const navigate = ReactRouterDOM.useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [tasksData, usersData] = await Promise.all([api.getTasks(), api.getUsers()]);
            setTasks(tasksData);
            setUsers(usersData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredTasks = useMemo(() => {
        const priorityOrder: Record<Priority, number> = {
            [Priority.Haute]: 3,
            [Priority.Normale]: 2,
            [Priority.Basse]: 1,
        };

        const tasksToFilter = activeDept === 'Tous les Départements' ? tasks : tasks.filter(task => task.department === activeDept);

        return [...tasksToFilter].sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'priority') {
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (sortBy === 'dueDate' || sortBy === 'createdAt') {
                comparison = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [tasks, activeDept, sortBy, sortOrder]);
    
    const validationTasks = useMemo(() => {
        return filteredTasks.filter(t => t.status === Status.PendingValidation);
    }, [filteredTasks]);

    const filteredUsers = useMemo(() => {
        if (activeDept === 'Tous les Départements') return users;
        return users.filter(user => user.department === activeDept);
    }, [users, activeDept]);

    const renderContent = () => {
        if(loading) return <p className="dark:text-slate-300">Chargement...</p>
        switch (activeSubTab) {
            case 'tasks':
                return <TasksView tasks={filteredTasks} users={users} sortBy={sortBy} setSortBy={setSortBy} sortOrder={sortOrder} setSortOrder={setSortOrder} />;
            case 'metrics':
                return <MetricsView tasks={filteredTasks} />;
            case 'team':
                return <TeamView users={filteredUsers} />;
            case 'validation':
                return <ValidationView tasks={validationTasks} users={users} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Gestion des Départements</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Supervision des équipes et des tâches départementales</p>
                </div>
                 <div className="flex items-center space-x-2">
                     <button onClick={() => alert('Fonctionnalité d\'exportation non implémentée.')} className="bg-white dark:bg-slate-700 border dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition duration-300 flex items-center">
                        <Upload className="w-4 h-4 mr-2" /> Exporter
                    </button>
                    <button onClick={() => navigate('/taches/creer')} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700 transition duration-300 flex items-center">
                        <Plus className="w-4 h-4 mr-2" /> Nouvelle Tâche
                    </button>
                </div>
            </div>

            <div className="border-b border-gray-200 dark:border-slate-700 mb-4">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    <button onClick={() => setActiveDept('Tous les Départements')} className={cn('whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm', activeDept === 'Tous les Départements' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600')}>
                        Tous les Départements <span className="ml-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.length}</span>
                    </button>
                    {departmentTabs.map(dept => {
                        const count = tasks.filter(t => t.department === dept).length;
                        if (count === 0) return null;
                        return (
                             <button key={dept} onClick={() => setActiveDept(dept)} className={cn('whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm', activeDept === dept ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600')}>
                                {dept} <span className="ml-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
                 <nav className="flex space-x-4" aria-label="Tabs">
                    {subTabs.map(tab => {
                        const isValidation = tab.id === 'validation';
                        const validationCount = validationTasks.length;
                        return (
                            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} className={cn('px-3 py-2 font-medium text-sm rounded-md', activeSubTab === tab.id ? 'bg-primary-100 text-primary-700 dark:bg-slate-700 dark:text-primary-400' : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50')}>
                                {tab.label} {isValidation && validationCount > 0 && <span className="ml-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{validationCount}</span>}
                            </button>
                        )
                    })}
                </nav>
            </div>
            
            <div>{renderContent()}</div>
        </div>
    );
};

export default Departments;
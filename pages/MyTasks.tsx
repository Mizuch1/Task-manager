import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { Task, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import { cn, formatDate } from '../utils';
// FIX: Using namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { MoreVertical, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { Priority, Status } from '../types';

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

const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border dark:border-slate-700 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <ReactRouterDOM.Link to={`/taches/${task.id}`} className="flex-1">
                 <div className="flex items-center space-x-2 mb-1">
                    {task.priority === Priority.Haute && <AlertTriangle className="w-4 h-4 text-red-500"/>}
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</h3>
                </div>
            </ReactRouterDOM.Link>
            <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 ml-2"><MoreVertical className="w-5 h-5"/></button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 my-2 line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4">
            <span>Échéance: {formatDate(task.dueDate)}</span>
            <div className="flex items-center space-x-2">
                 <span className={cn('font-medium px-2 py-0.5 rounded-full', statusColors[task.status])}>
                    {task.status}
                </span>
                <span className={cn('font-medium px-2 py-0.5 rounded-full', priorityColors[task.priority])}>
                    {task.priority}
                </span>
            </div>
        </div>
    </div>
);


const MyTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;
            setLoading(true);
            const allTasks = await api.getTasks();
            const myTasks = allTasks.filter(task => task.assignedTo.includes(user.id));
            setTasks(myTasks);

            // Send notifications for each assigned task
            myTasks.forEach(task => {
                api.notifyTaskAssignment(task.id, user.id);
            });
            
            setLoading(false);
        };
        fetchTasks();
    }, [user]);

    const sortedTasks = useMemo(() => {
        const priorityOrder: Record<Priority, number> = {
            [Priority.Haute]: 3,
            [Priority.Normale]: 2,
            [Priority.Basse]: 1,
        };

        return [...tasks].sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'priority') {
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (sortBy === 'dueDate' || sortBy === 'createdAt') {
                comparison = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
            }
            
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [tasks, sortBy, sortOrder]);

    if (loading) return <div className="dark:text-slate-200">Chargement de vos tâches...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Mes Tâches</h1>
                <div className="flex items-center space-x-2">
                    <label htmlFor="sort" className="text-sm font-medium text-slate-600 dark:text-slate-300">Trier par :</label>
                    <select
                        id="sort"
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
            {sortedTasks.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow">
                    <p className="text-slate-500 dark:text-slate-400">Vous n'avez aucune tâche assignée pour le moment.</p>
                </div>
            )}
        </div>
    );
};

export default MyTasks;
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
// FIX: Using namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { api } from '../services/api';
import type { Task } from '../types';
import { Department, Status, Priority, Category } from '../types';
import { ChevronDown, FileText, TrendingUp, SlidersHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
import { ALL_DEPARTMENTS, ALL_PRIORITIES, ALL_STATUSES, ALL_CATEGORIES } from '../constants';


const StatCard = ({ title, value, percentage, change, icon: Icon, iconBgColor }: { title: string, value: string, percentage?: string, change?: 'up' | 'down', icon: React.ElementType, iconBgColor: string }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-start justify-between">
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{value}</p>
            {percentage && (
                <div className={`flex items-center text-xs mt-1 ${change === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {change === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    <span>{percentage}</span>
                </div>
            )}
        </div>
        <div className={`p-2 rounded-full ${iconBgColor}`}>
            <Icon className="h-5 w-5 text-white" />
        </div>
    </div>
);

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = ReactRouterDOM.useNavigate();

    const initialFilters = {
        startDate: '',
        endDate: '',
        department: 'Tous les départements',
        category: 'Toutes les catégories',
        priority: 'Toutes les priorités',
        status: 'Tous les statuts',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [activeFilters, setActiveFilters] = useState(initialFilters);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const tasksData = await api.getTasks();
            setTasks(tasksData);
            setLoading(false);
        };
        fetchData();
    }, []);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    const applyFilters = () => {
        setActiveFilters(filters);
    };

    const resetFilters = () => {
        setFilters(initialFilters);
        setActiveFilters(initialFilters);
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            const startDate = activeFilters.startDate ? new Date(activeFilters.startDate) : null;
            const endDate = activeFilters.endDate ? new Date(activeFilters.endDate) : null;
    
            if (startDate) {
                startDate.setHours(0, 0, 0, 0);
                if (taskDate < startDate) return false;
            }
            if (endDate) {
                endDate.setHours(23, 59, 59, 999);
                if (taskDate > endDate) return false;
            }
    
            if (activeFilters.department !== 'Tous les départements' && task.department !== activeFilters.department) {
                return false;
            }
            if (activeFilters.category !== 'Toutes les catégories' && task.category !== activeFilters.category) {
                return false;
            }
            if (activeFilters.priority !== 'Toutes les priorités' && task.priority !== activeFilters.priority) {
                return false;
            }
            if (activeFilters.status !== 'Tous les statuts' && task.status !== activeFilters.status) {
                return false;
            }
    
            return true;
        });
    }, [tasks, activeFilters]);

    const stats = useMemo(() => {
        const totalTasks = filteredTasks.length;
        const terminatedTasks = filteredTasks.filter(t => t.status === Status.Done).length;
        const delayedTasks = filteredTasks.filter(t => t.status === Status.Delayed).length;
        const completionRate = totalTasks > 0 ? Math.round((terminatedTasks / totalTasks) * 100) : 0;
        
        // Dummy data for other stats
        const avgTime = "2.4 jours";
        const globalEfficiency = "87%";
        
        return {
            totalTasks,
            terminatedTasks,
            completionRate,
            delayedTasks,
            avgTime,
            globalEfficiency
        }
    }, [filteredTasks]);

    const tasksByDeptData = useMemo(() => {
        const departments = Object.values(Department);
        return departments.map(dept => ({
            name: dept,
            Terminées: filteredTasks.filter(t => t.department === dept && t.status === Status.Done).length,
            'En cours': filteredTasks.filter(t => t.department === dept && t.status === Status.InProgress).length,
            'En retard': filteredTasks.filter(t => t.department === dept && t.status === Status.Delayed).length,
        }));
    }, [filteredTasks]);
    
    const priorityData = useMemo(() => {
        return [
            { name: 'Haute', value: filteredTasks.filter(t => t.priority === Priority.Haute).length },
            { name: 'Normale', value: filteredTasks.filter(t => t.priority === Priority.Normale).length },
            { name: 'Basse', value: filteredTasks.filter(t => t.priority === Priority.Basse).length },
        ];
    }, [filteredTasks]);
    const COLORS = ['#EF4444', '#F97316', '#22C55E']; // red, orange, green for high, normal, low

    const productivityData = useMemo(() => {
      // Dummy data for trend chart
      return [
        { name: 'Jan', 'Taux de complétion': 75, 'Efficacité': 80, 'Qualité': 85 },
        { name: 'Fév', 'Taux de complétion': 78, 'Efficacité': 82, 'Qualité': 86 },
        { name: 'Mar', 'Taux de complétion': 80, 'Efficacité': 85, 'Qualité': 88 },
        { name: 'Avr', 'Taux de complétion': 82, 'Efficacité': 84, 'Qualité': 90 },
        { name: 'Mai', 'Taux de complétion': 85, 'Efficacité': 88, 'Qualité': 91 },
        { name: 'Juin', 'Taux de complétion': 83, 'Efficacité': 86, 'Qualité': 92 },
        { name: 'Juil', 'Taux de complétion': 88, 'Efficacité': 90, 'Qualité': 94 },
        { name: 'Août', 'Taux de complétion': 90, 'Efficacité': 92, 'Qualité': 95 },
        { name: 'Sep', 'Taux de complétion': 92, 'Efficacité': 93, 'Qualité': 96 },
      ];
    }, []);

    if (loading) return <div>Chargement des données...</div>;
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Statistiques des Tâches</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Analyse des performances et des métriques des départements.</p>
                </div>
                <div>
                    <button onClick={() => navigate('/departements')} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700 transition duration-300">
                        Gestion département
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow mb-6">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Filtres et Options</h2>
                     <button className="text-sm text-primary-600 dark:text-primary-400 font-medium">Masquer</button>
                </div>
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400">Date de début</label>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400">Date de fin</label>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400">Département</label>
                        <select name="department" value={filters.department} onChange={handleFilterChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-200">
                            <option>Tous les départements</option>
                            {ALL_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400">Catégories</label>
                        <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-200">
                            <option>Toutes les catégories</option>
                             {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400">Priorité</label>
                        <select name="priority" value={filters.priority} onChange={handleFilterChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-200">
                            <option>Toutes les priorités</option>
                            {ALL_PRIORITIES.map(p => <option key={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400">Statut</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-slate-200">
                            <option>Tous les statuts</option>
                            {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end items-center mt-4 space-x-2">
                    <button onClick={resetFilters} className="text-sm text-slate-600 dark:text-slate-300 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">Réinitialiser</button>
                    <button onClick={applyFilters} className="bg-primary-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700">Appliquer</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
                 <StatCard title="Total des tâches" value={stats.totalTasks.toString()} percentage="+12%" change="up" icon={FileText} iconBgColor="bg-blue-500" />
                 <StatCard title="Tâches terminées" value={stats.terminatedTasks.toString()} percentage="+18%" change="up" icon={FileText} iconBgColor="bg-green-500" />
                 <StatCard title="Taux de complétion" value={`${stats.completionRate}%`} percentage="+5%" change="up" icon={FileText} iconBgColor="bg-sky-500" />
                 <StatCard title="Tâches en retard" value={stats.delayedTasks.toString()} percentage="-12%" change="down" icon={FileText} iconBgColor="bg-red-500" />
                 <StatCard title="Temps moyen" value={stats.avgTime} percentage="-5%" change="down" icon={FileText} iconBgColor="bg-orange-500" />
                 <StatCard title="Efficacité globale" value={stats.globalEfficiency} percentage="+2%" change="up" icon={FileText} iconBgColor="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Complétion des tâches par département</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={tasksByDeptData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)"/>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }}/>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            <Legend wrapperStyle={{fontSize: "12px", color: '#94a3b8'}}/>
                            <Bar dataKey="Terminées" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="En cours" stackId="a" fill="#F97316" />
                            <Bar dataKey="En retard" stackId="a" fill="#EF4444" radius={[0, 0, 4, 4]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Distribution des priorités</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={priorityData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                                {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                            <Legend wrapperStyle={{fontSize: "12px", color: '#94a3b8'}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                 <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Tendance de productivité</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={productivityData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)"/>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }}/>
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }}/>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                        <Legend wrapperStyle={{fontSize: "12px", color: '#94a3b8'}}/>
                        <Line type="monotone" dataKey="Taux de complétion" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                        <Line type="monotone" dataKey="Efficacité" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                        <Line type="monotone" dataKey="Qualité" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                    </LineChart>
                 </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
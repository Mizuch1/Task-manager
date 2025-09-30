import React, { useState, useEffect, useRef } from 'react';
// FIX: Using namespace import for react-router-dom to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { api } from '../services/api';
import type { Task, User } from '../types';
import { Priority, Department, Category, Status } from '../types';
import { useAuth } from '../hooks/useAuth';
import { cn, formatDateTime, formatDate } from '../utils';
import { ALL_DEPARTMENTS, ALL_CATEGORIES, ALL_PRIORITIES, ALL_STATUSES } from '../constants';
import { Upload, Clock, User as UserIcon, Send, Pencil } from 'lucide-react';

const statusColors: Record<string, string> = {
  'En cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'En attente de validation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'À faire': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  'Terminée': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'En retard': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const TaskDetail = () => {
    const { id } = ReactRouterDOM.useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const [task, setTask] = useState<Task | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editableTask, setEditableTask] = useState<Task | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const beforeInputRef = useRef<HTMLInputElement>(null);
    const afterInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            const [taskData, usersData] = await Promise.all([
                api.getTaskById(id),
                api.getUsers()
            ]);
            setTask(taskData || null);
            setEditableTask(taskData || null);
            setUsers(usersData);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!editableTask) return;

        let finalValue: any = value;
        if (name === 'assignedTo') {
             finalValue = [value];
        }
        if (name === 'dueDate') {
            finalValue = new Date(value).toISOString();
        }

        setEditableTask({
            ...editableTask,
            [name]: finalValue,
        });
    };

    const handleSave = async () => {
        if (!editableTask || !currentUser) return;
        setLoading(true);
        const updatedTask = await api.updateTask(editableTask.id, editableTask, currentUser.id);
        if (updatedTask) {
            setTask(updatedTask);
            setEditableTask(updatedTask);
        }
        setIsEditing(false);
        setLoading(false);
    };

    const handleCancel = () => {
        setEditableTask(task);
        setIsEditing(false);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser || !task) return;

        setIsSubmittingComment(true);
        try {
            const updatedTask = await api.addCommentToTask(task.id, currentUser.id, newComment);
            if (updatedTask) {
                setTask(updatedTask);
                setEditableTask(updatedTask); 
            }
            setNewComment('');
        } catch (error) {
            console.error("Failed to add comment:", error);
            alert("Erreur lors de l'ajout du commentaire.");
        } finally {
            setIsSubmittingComment(false);
        }
    };
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        const file = event.target.files?.[0];
        if (!file || !editableTask || !currentUser) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64String = reader.result as string;
            
            const updatedFields = type === 'before' 
                ? { beforeImageUrl: base64String } 
                : { afterImageUrl: base64String };

            const optimisticTask = { ...editableTask, ...updatedFields };
            setTask(optimisticTask);
            setEditableTask(optimisticTask);
            
            const updatedTask = await api.updateTask(editableTask.id, updatedFields, currentUser.id);
            if (updatedTask) {
                setTask(updatedTask);
                setEditableTask(updatedTask);
            } else {
                setTask(task);
                setEditableTask(task);
                alert("Échec du téléchargement de l'image.");
            }
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("Erreur lors de la lecture du fichier.");
        };
    };

    const getUserById = (userId: string) => users.find(u => u.id === userId);
    
    if (loading && !task) return <div className="dark:text-slate-200">Chargement de la tâche...</div>;
    if (!task || !editableTask) return <div className="dark:text-slate-200">Tâche non trouvée.</div>;
    
    const assignedUser = getUserById(task.assignedTo[0]);
    const creatorUser = getUserById(task.createdBy);
    const sortedHistory = [...task.history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const sortedComments = [...task.comments].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Tableau de bord / Détails de la tâche / #{task.id.slice(-4)}</p>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{task.title}</h1>
                </div>
                 <span className={cn('text-sm font-semibold px-3 py-1 rounded-full', statusColors[task.status])}>
                    {task.status}
                </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-6">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Détails de la Tâche</h3>
                     {!isEditing && (
                         <button onClick={() => setIsEditing(true)} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                            <Pencil className="w-4 h-4 mr-1" /> Modifier
                        </button>
                     )}
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <div><label className="text-sm font-medium dark:text-slate-300">Titre</label><input name="title" value={editableTask.title} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" /></div>
                        <div><label className="text-sm font-medium dark:text-slate-300">Description</label><textarea name="description" value={editableTask.description} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" rows={4}></textarea></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className="text-sm font-medium dark:text-slate-300">Assigné à</label><select name="assignedTo" value={editableTask.assignedTo[0]} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">{users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}</select></div>
                            <div><label className="text-sm font-medium dark:text-slate-300">Date limite</label><input name="dueDate" type="date" value={editableTask.dueDate.split('T')[0]} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200" /></div>
                            <div><label className="text-sm font-medium dark:text-slate-300">Priorité</label><select name="priority" value={editableTask.priority} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">{ALL_PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></div>
                            <div><label className="text-sm font-medium dark:text-slate-300">Département</label><select name="department" value={editableTask.department} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">{ALL_DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></div>
                            <div><label className="text-sm font-medium dark:text-slate-300">Catégorie</label><select name="category" value={editableTask.category} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">{ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                             <div><label className="text-sm font-medium dark:text-slate-300">Statut</label><select name="status" value={editableTask.status} onChange={handleInputChange} className="w-full mt-1 p-2 border dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200">{ALL_STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button onClick={handleCancel} className="text-slate-600 dark:text-slate-300 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">Annuler</button>
                            <button onClick={handleSave} disabled={loading} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700 disabled:bg-primary-300">
                                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-wrap">{task.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div><p className="text-slate-500 dark:text-slate-400">Assigné à</p><p className="font-semibold text-slate-800 dark:text-slate-200">{assignedUser?.firstName} {assignedUser?.lastName}</p></div>
                            <div><p className="text-slate-500 dark:text-slate-400">Créé par</p><p className="font-semibold text-slate-800 dark:text-slate-200">{creatorUser?.firstName} {creatorUser?.lastName}</p></div>
                            <div><p className="text-slate-500 dark:text-slate-400">Date limite</p><p className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(task.dueDate)}</p></div>
                            <div><p className="text-slate-500 dark:text-slate-400">Département</p><p className="font-semibold text-slate-800 dark:text-slate-200">{task.department}</p></div>
                            <div><p className="text-slate-500 dark:text-slate-400">Priorité</p><p className="font-semibold text-slate-800 dark:text-slate-200">{task.priority}</p></div>
                            <div><p className="text-slate-500 dark:text-slate-400">Catégorie</p><p className="font-semibold text-slate-800 dark:text-slate-200">{task.category}</p></div>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Photos de Vérification</h3>
                        <input type="file" ref={beforeInputRef} onChange={(e) => handleFileChange(e, 'before')} className="hidden" accept="image/*" />
                        <input type="file" ref={afterInputRef} onChange={(e) => handleFileChange(e, 'after')} className="hidden" accept="image/*" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium mb-2 dark:text-slate-300">Photo Avant</h4>
                                {task.beforeImageUrl ? (
                                    <div className="relative group">
                                        <img src={task.beforeImageUrl} alt="Avant" className="w-full h-48 rounded-lg object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 rounded-lg">
                                            <button onClick={() => beforeInputRef.current?.click()} className="flex items-center text-white bg-slate-800 bg-opacity-70 px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="w-4 h-4 mr-2" /> Changer
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => beforeInputRef.current?.click()} className="w-full h-48 border-2 border-dashed dark:border-slate-600 rounded-lg flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                        <span>Télécharger une photo</span>
                                    </button>
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 dark:text-slate-300">Photo Après</h4>
                                {task.afterImageUrl ? (
                                    <div className="relative group">
                                        <img src={task.afterImageUrl} alt="Après" className="w-full h-48 rounded-lg object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 rounded-lg">
                                            <button onClick={() => afterInputRef.current?.click()} className="flex items-center text-white bg-slate-800 bg-opacity-70 px-3 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="w-4 h-4 mr-2" /> Changer
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => afterInputRef.current?.click()} className="w-full h-48 border-2 border-dashed dark:border-slate-600 rounded-lg flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                        <span>Télécharger une photo</span>
                                    </button>
                                )}
                            </div>
                        </div>
                         <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">Les photos avant et après sont obligatoires pour marquer cette tâche comme terminée.</p>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Commentaires ({task.comments.length})</h3>
                        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2">
                            {sortedComments.length > 0 ? (
                                sortedComments.map((comment, index) => {
                                    const commentUser = getUserById(comment.userId);
                                    return (
                                    <div key={comment.id} className={cn('flex items-start space-x-3', index > 0 && 'pt-4 border-t border-slate-200 dark:border-slate-700')}>
                                        <img src={commentUser?.avatarUrl} className="w-8 h-8 rounded-full" alt="avatar"/>
                                        <div>
                                            <p className="text-sm">
                                                <span className="font-semibold dark:text-slate-200">{commentUser?.firstName} {commentUser?.lastName}</span>
                                                <span className="text-slate-500 dark:text-slate-400 ml-2 text-xs">{formatDateTime(comment.timestamp)}</span>
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{comment.text}</p>
                                        </div>
                                    </div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    <p>Aucun commentaire pour le moment.</p>
                                    <p className="text-xs">Soyez le premier à en ajouter un !</p>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                             <img src={currentUser?.avatarUrl} className="w-8 h-8 rounded-full" alt="current user avatar" />
                             <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    placeholder="Ajouter un commentaire..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    disabled={isSubmittingComment}
                                    className="w-full border dark:border-slate-600 rounded-full py-2 pl-4 pr-12 bg-white dark:bg-slate-700 dark:text-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-600 focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                                <button 
                                    type="submit"
                                    disabled={isSubmittingComment || !newComment.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-primary-300 dark:disabled:bg-primary-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-primary-500"
                                    aria-label="Envoyer le commentaire">
                                    <Send className="w-4 h-4" />
                                </button>
                             </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Historique de la Tâche</h3>
                        <div className="flow-root">
                             <ul role="list" className="-mb-8">
                                {sortedHistory.map((item, itemIdx) => {
                                    const historyUser = getUserById(item.userId);
                                    return (
                                        <li key={item.id}>
                                            <div className="relative pb-8">
                                                {itemIdx !== sortedHistory.length - 1 ? (
                                                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                                                ) : null}
                                                <div className="relative flex space-x-3">
                                                    <div>
                                                        <span className="h-8 w-8 rounded-full bg-primary-100 dark:bg-slate-700 flex items-center justify-center ring-8 ring-white dark:ring-slate-800">
                                                            <Clock className="h-5 w-5 text-primary-500" aria-hidden="true" />
                                                        </span>
                                                    </div>
                                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                        <div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                                {item.action} par <span className="font-medium text-slate-900 dark:text-slate-100">{historyUser?.firstName}</span>
                                                            </p>
                                                        </div>
                                                        <div className="whitespace-nowrap text-right text-xs text-slate-500 dark:text-slate-400">
                                                            <time dateTime={item.timestamp}>{formatDateTime(item.timestamp)}</time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                             </ul>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Actions Rapides</h3>
                        <div className="space-y-2">
                             <button onClick={() => beforeInputRef.current?.click()} className="w-full text-left p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center text-sm dark:text-slate-300"><Upload className="w-4 h-4 mr-2"/> Télécharger Photo Avant</button>
                             <button onClick={() => afterInputRef.current?.click()} className="w-full text-left p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center text-sm dark:text-slate-300"><Upload className="w-4 h-4 mr-2"/> Télécharger Photo Après</button>
                             <button className="w-full text-left p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center text-sm dark:text-slate-300"><Clock className="w-4 h-4 mr-2"/> Voir Statistiques</button>
                             <button className="w-full text-left p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center text-sm dark:text-slate-300"><UserIcon className="w-4 h-4 mr-2"/> Gestion Equipe</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
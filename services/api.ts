import type { User, Task, Comment } from '../types';
import { Role, Department, Priority, Status, Category } from '../types';

let users: User[] = [
    { id: 'user-1', firstName: 'Amina', lastName: 'El Fassi', email: 'chef.production@asment.ma', role: Role.ChefDepartement, department: Department.Production, avatarUrl: 'https://picsum.photos/id/1027/100/100' },
    { id: 'user-2', firstName: 'Youssef', lastName: 'Alami', email: 'ilyass.ait@asment.ma', role: Role.Ingenieur, department: Department.Maintenance, avatarUrl: 'https://picsum.photos/id/1005/100/100' },
    { id: 'user-3', firstName: 'Karim', lastName: 'Tazi', email: 'ahmed.tech@asment.ma', role: Role.Technicien, department: Department.Maintenance, avatarUrl: 'https://picsum.photos/id/1011/100/100', phone: '+212 6 12 34 56 78'},
    { id: 'user-4', firstName: 'Fatima', lastName: 'Idrissi', email: 'fatima.zahra@asment.ma', role: Role.Technicien, department: Department.Production, avatarUrl: 'https://picsum.photos/id/1025/100/100' },
    { id: 'user-5', firstName: 'Omar', lastName: 'Berrada', email: 'rachid.ouafi@asment.ma', role: Role.Technicien, department: Department.Technologie, avatarUrl: 'https://picsum.photos/id/1012/100/100' },
    { id: 'user-6', firstName: 'Kenza', lastName: 'Bennani', email: 'aicha.bennani@asment.ma', role: Role.Ingenieur, department: Department.Qualite, avatarUrl: 'https://picsum.photos/id/1013/100/100' },
    { id: 'user-admin', firstName: 'Said', lastName: 'Alaoui', email: 'admin@asment.ma', role: Role.Admin, department: Department.AdminRH, avatarUrl: 'https://picsum.photos/id/10/100/100' },
];

let tasks: Task[] = [
    { 
        id: 'task-1',
        title: 'Maintenance préventive du broyeur principal #2', 
        description: 'Vérification et remplacement des pièces d\'usure du broyeur principal selon le planning de maintenance préventive. Inclut : - Vérification des roulements - Contrôle de l\'alignement - Remplacement des filtres - Test de vibrations - Nettoyage complet du système', 
        priority: Priority.Haute, status: Status.InProgress, category: Category.Maintenance, 
        dueDate: '2025-08-01T00:00:00.000Z', 
        department: Department.Maintenance, 
        createdBy: 'user-1', assignedTo: ['user-3'],
        createdAt: '2025-07-28T09:00:00.000Z',
        beforeImageUrl: 'https://picsum.photos/seed/task1before/800/600',
        afterImageUrl: null,
        history: [
            {id: 'h1-1', userId: 'user-1', action: 'Tâche créée et planifiée', timestamp: '2025-07-28T09:00:00.000Z'},
            {id: 'h1-2', userId: 'user-1', action: 'Tâche assignée à Karim Tazi', timestamp: '2025-07-28T09:15:00.000Z'},
            {id: 'h1-3', userId: 'user-3', action: 'Début des travaux de maintenance', timestamp: '2025-07-29T09:02:00.000Z'},
            {id: 'h1-4', userId: 'user-3', action: 'Photo avant maintenance téléchargée', timestamp: '2025-07-29T09:03:00.000Z'},
        ],
        comments: [
            {id: 'c1-1', userId: 'user-3', text: 'Technicien - A noter, l\'un des roulements montre des signes d\'usure mais reste dans les tolérances acceptables.', timestamp: '2025-07-29T14:30:00.000Z'},
            {id: 'c1-2', userId: 'user-1', text: 'Merci pour le rapport, Karim. Veuillez commander un nouveau roulement pour la prochaine maintenance.', timestamp: '2025-07-29T15:00:00.000Z'}
        ]
    },
    { 
        id: 'task-2', 
        title: 'Contrôle qualité ciment Portland', 
        description: 'Tests de résistance et analyse chimique du ciment Portland produit ce matin selon les normes NM 10.1.004.', 
        priority: Priority.Normale, status: Status.PendingValidation, category: Category.Qualite, 
        dueDate: '2025-08-05T00:00:00.000Z', 
        department: Department.Qualite,
        createdBy: 'user-1', assignedTo: ['user-6'],
        createdAt: '2025-08-05T08:00:00.000Z',
        beforeImageUrl: 'https://picsum.photos/seed/task2before/800/600',
        afterImageUrl: 'https://picsum.photos/seed/task2after/800/600',
        history: [], 
        comments: [
            {id: 'c2-1', userId: 'user-6', text: 'Les tests de résistance sont conformes. J\'attends les résultats de l\'analyse chimique.', timestamp: '2025-08-05T10:00:00.000Z'},
            {id: 'c2-2', userId: 'user-1', text: 'Kenza, est-ce que les résultats seront disponibles avant midi ?', timestamp: '2025-08-05T11:00:00.000Z'}
        ],
    },
    { 
        id: 'task-3',
        title: 'Inspection des silos de stockage', 
        description: 'Inspection visuelle et technique des silos de stockage du clinker pour détecter d\'éventuelles fissures ou anomalies.', 
        priority: Priority.Normale, status: Status.Todo, category: Category.Production, 
        dueDate: '2025-08-08T00:00:00.000Z', 
        department: Department.Production,
        createdBy: 'user-1', assignedTo: ['user-4'],
        createdAt: '2025-08-06T11:00:00.000Z',
        history: [], 
        comments: [
            {id: 'c3-1', userId: 'user-4', text: 'J\'aurai besoin d\'un harnais de sécurité pour l\'inspection en hauteur. Est-ce que c\'est disponible au magasin ?', timestamp: '2025-08-07T09:00:00.000Z'}
        ],
    },
    { 
        id: 'task-4', 
        title: 'Calibrage des instruments de mesure', 
        description: 'Calibrage annuel des instruments de mesure de température et pression dans la zone de cuisson.', 
        priority: Priority.Haute, status: Status.Delayed, category: Category.Maintenance, 
        dueDate: '2025-07-30T00:00:00.000Z', 
        department: Department.Technologie,
        createdBy: 'user-1', assignedTo: ['user-5'],
        createdAt: '2025-07-20T10:00:00.000Z',
        history: [], 
        comments: [
            {id: 'c4-1', userId: 'user-1', text: 'Omar, quel est le statut de cette tâche ? Elle est en retard.', timestamp: '2025-07-31T10:00:00.000Z'},
            {id: 'c4-2', userId: 'user-5', text: 'Le manomètre de rechange n\'a pas encore été livré. Je relance le fournisseur aujourd\'hui.', timestamp: '2025-07-31T11:30:00.000Z'}
        ],
    },
    { 
        id: 'task-5', 
        title: 'Nettoyage convoyeur C-03', 
        description: 'Nettoyage complet de la bande et des rouleaux du convoyeur C-03.', 
        priority: Priority.Basse, status: Status.Done, category: Category.Production, 
        dueDate: '2025-07-25T00:00:00.000Z', 
        completedAt: '2025-07-24T16:00:00.000Z',
        department: Department.Production,
        createdBy: 'user-1', assignedTo: ['user-4'],
        createdAt: '2025-07-24T09:00:00.000Z',
        beforeImageUrl: 'https://picsum.photos/seed/task5before/800/600',
        afterImageUrl: 'https://picsum.photos/seed/task5after/800/600',
        history: [], 
        comments: [
             {id: 'c5-1', userId: 'user-4', text: 'Nettoyage terminé. Le convoyeur est de nouveau opérationnel.', timestamp: '2025-07-24T15:45:00.000Z'}
        ],
    },
    {
      id: 'task-6',
      title: 'Formation sécurité nouveaux équipements',
      description: 'Session de formation pour les techniciens sur les nouvelles procédures de sécurité des équipements installés.',
      priority: Priority.Haute,
      status: Status.Done,
      category: Category.Securite,
      dueDate: '2025-08-15T00:00:00.000Z',
      completedAt: '2025-08-14T12:00:00.000Z',
      department: Department.AdminRH,
      createdBy: 'user-admin',
      assignedTo: ['user-2', 'user-3', 'user-5'],
      createdAt: '2025-08-01T14:20:00.000Z',
      history: [],
      comments: [
          {id: 'c6-1', userId: 'user-2', text: 'Est-ce que la documentation technique sera fournie avant la formation ?', timestamp: '2025-08-10T14:00:00.000Z'},
          {id: 'c6-2', userId: 'user-admin', text: 'Oui, la documentation sera envoyée par email à tous les participants demain matin.', timestamp: '2025-08-10T16:00:00.000Z'}
      ],
    },
    {
      id: 'task-7',
      title: 'Audit interne du système de management',
      description: 'Préparation et réalisation de l\'audit interne QSE pour le département Maintenance.',
      priority: Priority.Normale,
      status: Status.Todo,
      category: Category.Qualite,
      dueDate: '2025-09-02T00:00:00.000Z',
      department: Department.Qualite,
      createdBy: 'user-1',
      assignedTo: ['user-6'],
      createdAt: '2025-08-20T16:00:00.000Z',
      history: [],
      comments: [
          {id: 'c7-1', userId: 'user-6', text: 'J\'ai préparé la liste de contrôle pour l\'audit. Je commence les entretiens lundi.', timestamp: '2025-08-22T11:00:00.000Z'}
      ],
    },
    {
      id: 'task-8',
      title: 'Remplacement des filtres à manche',
      description: 'Remplacement programmé des filtres à manche du four principal.',
      priority: Priority.Haute,
      status: Status.InProgress,
      category: Category.Maintenance,
      dueDate: '2025-08-28T00:00:00.000Z',
      department: Department.Maintenance,
      createdBy: 'user-1',
      assignedTo: ['user-3'],
      createdAt: '2025-08-26T08:30:00.000Z',
      history: [],
      comments: [
          {id: 'c8-1', userId: 'user-3', text: 'L\'accès à la zone est sécurisé. Je commence le démontage des anciens filtres.', timestamp: '2025-08-26T09:15:00.000Z'}
      ],
    },
    {
      id: 'task-9',
      title: 'Mise à jour de sécurité des serveurs',
      description: 'Appliquer les derniers correctifs de sécurité sur les serveurs de production et de base de données.',
      priority: Priority.Haute,
      status: Status.Todo,
      category: Category.Securite,
      dueDate: '2025-08-22T00:00:00.000Z',
      department: Department.Technologie,
      createdBy: 'user-admin',
      assignedTo: ['user-5'],
      createdAt: '2025-08-19T10:00:00.000Z',
      history: [],
      comments: [
           {id: 'c9-1', userId: 'user-5', text: 'La mise à jour sera effectuée pendant la nuit pour minimiser l\'impact sur la production.', timestamp: '2025-08-20T15:00:00.000Z'}
      ],
    },
    {
      id: 'task-10',
      title: 'Déploiement du nouveau logiciel de GMAO',
      description: 'Installer et configurer le nouveau système de Gestion de la Maintenance Assistée par Ordinateur.',
      priority: Priority.Normale,
      status: Status.InProgress,
      category: Category.Autre,
      dueDate: '2025-09-04T00:00:00.000Z',
      department: Department.Technologie,
      createdBy: 'user-admin',
      assignedTo: ['user-5', 'user-2'],
      createdAt: '2025-07-15T09:00:00.000Z',
      history: [],
      comments: [
          {id: 'c10-1', userId: 'user-2', text: 'Omar, est-ce que la migration des anciennes données est terminée ?', timestamp: '2025-07-25T10:00:00.000Z'},
          {id: 'c10-2', userId: 'user-5', text: 'Oui Youssef, la migration est terminée à 90%. Quelques ajustements manuels sont nécessaires.', timestamp: '2025-07-25T14:00:00.000Z'}
      ],
    },
    {
      id: 'task-11',
      title: 'Formation des utilisateurs au nouveau portail RH',
      description: 'Organiser et animer une session de formation pour tous les employés sur l\'utilisation du nouveau portail RH.',
      priority: Priority.Normale,
      status: Status.Done,
      category: Category.Autre,
      dueDate: '2025-07-30T00:00:00.000Z',
      completedAt: '2025-07-29T16:30:00.000Z',
      department: Department.AdminRH,
      createdBy: 'user-admin',
      assignedTo: ['user-5'],
      createdAt: '2025-07-20T11:00:00.000Z',
      history: [],
      comments: [
          {id: 'c11-1', userId: 'user-admin', text: 'La salle de formation est réservée. Les invitations ont été envoyées à tout le personnel.', timestamp: '2025-07-22T10:30:00.000Z'}
      ],
    }
];

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
    login: async (email: string, password: string): Promise<User | null> => {
        await delay(500);
        const user = users.find(u => u.email === email);
        // In a real app, passwords would be hashed. For this demo, we use a simple check.
        if (user && password === 'demo123') {
            return user;
        }
        return null;
    },

    getUsers: async (): Promise<User[]> => {
        await delay(200);
        return [...users];
    },
    
    getUserById: async (id: string): Promise<User | undefined> => {
        await delay(100);
        return users.find(u => u.id === id);
    },

    getTasks: async (): Promise<Task[]> => {
        await delay(300);
        // Add derived 'En retard' status
        const now = new Date();
        return [...tasks].map(task => {
            if (task.status !== Status.Done && new Date(task.dueDate) < now) {
                return { ...task, status: Status.Delayed };
            }
            return task;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    getTaskById: async (id: string): Promise<Task | undefined> => {
        await delay(200);
        const task = tasks.find(t => t.id === id);
        if(!task) return undefined;

        const now = new Date();
        if (task.status !== Status.Done && new Date(task.dueDate) < now) {
            return { ...task, status: Status.Delayed };
        }
        return task;
    },
    
    createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'history' | 'comments' | 'status'>): Promise<Task> => {
        await delay(400);
        const newTask: Task = {
            ...taskData,
            id: `task-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: Status.Todo,
            history: [{
                id: `h-${Date.now()}`,
                userId: taskData.createdBy,
                action: 'Tâche créée',
                timestamp: new Date().toISOString()
            }],
            comments: []
        };
        tasks.push(newTask);
        return newTask;
    },

    updateTask: async (taskId: string, updates: Partial<Task>, userId: string): Promise<Task | undefined> => {
        await delay(300);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            return undefined;
        }
        
        const originalTask = tasks[taskIndex];
        const updatedTask = { ...originalTask, ...updates };

        const newHistoryItem = {
            id: `h-${Date.now()}`,
            userId: userId,
            action: 'Détails de la tâche mis à jour',
            timestamp: new Date().toISOString()
        };
        
        if (!updatedTask.history) {
            updatedTask.history = [];
        }
        updatedTask.history.push(newHistoryItem);

        tasks[taskIndex] = updatedTask;
        return tasks[taskIndex];
    },

    addCommentToTask: async (taskId: string, userId: string, text: string): Promise<Task | undefined> => {
        await delay(400);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            return undefined;
        }

        const task = tasks[taskIndex];

        const newComment: Comment = {
            id: `c-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId,
            text
        };
        
        task.comments.push(newComment);

        const historyItem = {
            id: `h-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId,
            action: 'A ajouté un commentaire',
        };

        if(!task.history) {
            task.history = [];
        }
        task.history.push(historyItem);
        
        tasks[taskIndex] = task;

        return task;
    },

    notifyTaskAssignment: async (taskId: string, userId: string): Promise<void> => {
        await delay(100);
        const user = users.find(u => u.id === userId);
        const task = tasks.find(t => t.id === taskId);
        if (user && task) {
            console.log(`[Notification] User ${user.firstName} ${user.lastName} has been notified for task: "${task.title}"`);
        } else {
            console.warn(`[Notification] Could not send notification. User or Task not found for taskId: ${taskId}, userId: ${userId}`);
        }
    }
};
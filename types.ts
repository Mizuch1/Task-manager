
export enum Role {
  Admin = 'Admin',
  ChefDepartement = 'Chef de Département',
  Ingenieur = 'Ingénieur',
  Technicien = 'Technicien',
}

export enum Department {
  Production = 'Production',
  Maintenance = 'Maintenance',
  Qualite = 'Qualité & Contrôle',
  Technologie = 'Technologies Opérationnelles',
  AdminRH = 'Administration & RH',
}

export enum Priority {
  Haute = 'Haute',
  Normale = 'Normale',
  Basse = 'Basse',
}

export enum Status {
  Todo = 'À faire',
  InProgress = 'En cours',
  PendingValidation = 'En attente de validation',
  Done = 'Terminée',
  Delayed = 'En retard'
}

export enum Category {
  Maintenance = 'Maintenance',
  Production = 'Production',
  Qualite = 'Qualité',
  Securite = 'Sécurité',
  Autre = 'Autre',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: Department;
  avatarUrl?: string;
  phone?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: Category;
  dueDate: string; // ISO String
  department: Department;
  createdBy: string; // User ID
  assignedTo: string[]; // User IDs
  beforeImageUrl?: string | null;
  afterImageUrl?: string | null;
  completedAt?: string | null; // ISO String
  createdAt: string; // ISO String
  history: TaskHistoryItem[];
  comments: Comment[];
}

export interface TaskHistoryItem {
    id: string;
    timestamp: string; // ISO String
    userId: string;
    action: string;
}

export interface Comment {
    id: string;
    timestamp: string; // ISO String
    userId: string;
    text: string;
}

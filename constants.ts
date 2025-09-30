
import type { Role } from './types';
import { Home, ClipboardList, Building, BarChart3, User as UserIcon } from 'lucide-react';

export const NAV_LINKS = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: Home, roles: [ 'Admin', 'Chef de Département', 'Ingénieur' ] },
  { href: '/departements', label: 'Départements', icon: Building, roles: [ 'Admin', 'Chef de Département' ] },
  { href: '/taches', label: 'Mes Tâches', icon: ClipboardList, roles: [ 'Technicien', 'Ingénieur' ] },
  // { href: '/statistiques', label: 'Statistiques', icon: BarChart3, roles: [ 'Admin', 'Chef de Département' ] },
];

export const ALL_DEPARTMENTS = [
    'Production',
    'Maintenance',
    'Qualité & Contrôle',
    'Technologies Opérationnelles',
    'Administration & RH'
];

export const ALL_STATUSES = [
    'À faire',
    'En cours',
    'En attente de validation',
    'Terminée',
    'En retard'
];

export const ALL_PRIORITIES = ['Haute', 'Normale', 'Basse'];

export const ALL_CATEGORIES = ['Maintenance', 'Production', 'Qualité', 'Sécurité', 'Autre'];

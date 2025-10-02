
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, formatStr: string = 'dd/MM/yyyy') {
  if(!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, formatStr, { locale: fr });
  } catch (error) {
    console.error("Invalid date format:", dateString);
    return dateString;
  }
}

export function formatDateTime(dateString: string) {
    if(!dateString) return '';
    return formatDate(dateString, "dd/MM/yyyy 'à' HH:mm");
}

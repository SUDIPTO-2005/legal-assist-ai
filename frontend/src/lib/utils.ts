import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
}

export function getRiskColor(level: string): { bg: string; text: string; border: string; badge: string } {
  switch (level?.toLowerCase()) {
    case 'low':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800'
      };
    case 'medium':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800'
      };
    case 'high':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-800'
      };
    case 'legal_review_advised':
    case 'critical':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-300',
        badge: 'bg-red-100 text-red-800 animate-pulse'
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-800'
      };
  }
}

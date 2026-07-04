import type { TaskStatus } from '../types/task';

export type ThemeColors = {
  bg: string;
  bgAlt: string;
  card: string;
  text: string;
  sub: string;
  primary: string;
  primarySoft: string;
  accent: string;
  border: string;
  danger: string;
  ok: string;
  warning: string;
  headerFrom: string;
  headerTo: string;
  tabBar: string;
  input: string;
  shadow: string;
  overlay: string;
};

export const lightTheme: ThemeColors = {
  bg: '#EEF2FF',
  bgAlt: '#E0E7FF',
  card: '#FFFFFF',
  text: '#0F172A',
  sub: '#64748B',
  primary: '#4F46E5',
  primarySoft: '#EEF2FF',
  accent: '#F97316',
  border: '#E2E8F0',
  danger: '#EF4444',
  ok: '#10B981',
  warning: '#F59E0B',
  headerFrom: '#4338CA',
  headerTo: '#7C3AED',
  tabBar: '#FFFFFF',
  input: '#F8FAFC',
  shadow: '#6366F1',
  overlay: 'rgba(15, 23, 42, 0.45)',
};

export const darkTheme: ThemeColors = {
  bg: '#0B1120',
  bgAlt: '#111827',
  card: '#1A2235',
  text: '#F1F5F9',
  sub: '#94A3B8',
  primary: '#818CF8',
  primarySoft: '#1E1B4B',
  accent: '#FB923C',
  border: '#2D3748',
  danger: '#F87171',
  ok: '#34D399',
  warning: '#FBBF24',
  headerFrom: '#312E81',
  headerTo: '#581C87',
  tabBar: '#111827',
  input: '#0F172A',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const ACTION_ICONS: Record<string, string> = {
  created: '✨',
  updated: '✏️',
  status_changed: '🔄',
  attachment_added: '📎',
  attachment_removed: '🗑️',
  deleted: '❌',
  synced: '☁️',
  sync_failed: '⚠️',
};

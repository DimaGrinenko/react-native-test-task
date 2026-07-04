export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatTimeLeft(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return 'Просрочено';
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 48) return `${Math.floor(hours / 24)} дн.`;
  if (hours > 0) return `${hours} ч ${mins} мин`;
  return `${mins} мин`;
}

export function isOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

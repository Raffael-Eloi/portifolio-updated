export const formatDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = endDate.toLowerCase() === 'present' ? new Date() : new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

  const totalMonths =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth());
  if (totalMonths <= 0) return '';

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  return parts.join(' ');
};

export const formatDate =(dateString: string): string => {
  if (!dateString) return '';
  if (dateString.toLowerCase() === 'present') return 'Present';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid

  // If it's just a year "YYYY"
  if (dateString.length === 4) {
    return dateString;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

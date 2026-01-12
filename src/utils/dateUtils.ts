export const formatDate = (dateString: string): string => {
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
  }).format(date);
};

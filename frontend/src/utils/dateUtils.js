export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (isoTime) => {
  if (!isoTime) return '';
  return isoTime.slice(0, 5);
};

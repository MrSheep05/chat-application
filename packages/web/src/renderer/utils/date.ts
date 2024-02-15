export const formatDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(timestamp));
};

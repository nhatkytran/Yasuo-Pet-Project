const countYear = year => {
  const difference = Math.abs(year - new Date().getFullYear());
  if (difference === 0) return 'In this year';
  if (difference === 1) return '1 year ago';
  return `${difference} years ago`;
};

export default countYear;

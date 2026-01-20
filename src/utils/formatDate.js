function formatDate(isoDate) {
  if (!isoDate) return null;

  const date = new Date(isoDate);

  return date.toISOString().split("T")[0];
}

module.exports = {
  formatDate
};

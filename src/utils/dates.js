export const Last7Days = () => {
  const result = [];
  function formatDate(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    date = `${mm}/${dd}/${yyyy}`;
    return date;
  }
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(formatDate(d));
  }
  return result.reverse();
};

export const getDay = (day, start) => {
  const date = new Date(day);
  if (start) {
    return new Date(date.setHours(0, 0, 0, 0));
  }
  return new Date(date.setHours(23, 59, 59, 999));
};

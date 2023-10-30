export const sort = (cities) => {
  return cities.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};

export const ddmmyyyyFormat = (date) => {
  var dateobj = new Date(date);
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  var result =
    pad(dateobj.getDate()) +
    "-" +
    pad(dateobj.getMonth() + 1) +
    "-" +
    dateobj.getFullYear();
  return result;
};

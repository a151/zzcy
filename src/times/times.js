export default {
  time(v) {
    var v = v / 1
    var date = new Date(v);
    return (
      date.getFullYear() + "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") + "-" +
      date.getDate().toString().padStart(2, "0") + " "
    );
  }
};

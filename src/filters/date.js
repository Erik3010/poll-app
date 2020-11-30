import Vue from "vue";

Vue.filter("date", (value) => {
  let date = new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    date: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);
});

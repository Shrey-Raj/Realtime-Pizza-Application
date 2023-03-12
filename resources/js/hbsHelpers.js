const hbs = require("hbs");
const moment = require('moment') ; 

hbs.registerHelper("substring", function (str, start, end) {
  return str.substring(start, end);
});


// Helper function to format a timestamp as a string
hbs.registerHelper('formatDate', function (date, format) {
  return moment(date).format(format);
});

// Helper function to capitalize the first letter of a string
hbs.registerHelper('capitalize', function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

// Register the eq helper : Used in updating the status of the order in real time , Check admin/orders in views
hbs.registerHelper('eq', function(a, b) {
  return a === b;
});
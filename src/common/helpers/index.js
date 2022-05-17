const moment = require('moment-timezone');

exports.currentMxDate = () => {
  return moment.tz('America/Mexico_City');
};

exports.currentMxDateTz = () => {
  return moment.tz('America/Mexico_City').format('YYYY-MM-DDTHH:mm:ss');
};

exports.setHoursDates = (hours) => {
  return moment.tz('America/Mexico_City').add(hours, 'hours');
};

exports.setMinutesDate = (minutes) => {
  return moment.tz('America/Mexico_City').add(minutes, 'm');
};

exports.setSecondsDate = (seconds) => {
  return moment.tz('America/Mexico_City').add(seconds, 's');
};

exports.roundOut = (num, decimals = 2) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

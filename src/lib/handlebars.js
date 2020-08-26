const {format} = require('timeago.js');

const herlpers = {};

herlpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = herlpers;
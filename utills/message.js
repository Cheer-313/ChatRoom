const moment = require('moment');

module.exports = formatMessage;

function formatMessage(username, text, id = 'bot') {
    return { id, username, text, time: moment().format("l LT") };
}
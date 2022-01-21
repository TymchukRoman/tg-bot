const ping = require('../commands/ping.js');
const reminder = require('../commands/reminder.js');
const help = require('../commands/help.js');
const list = require('../commands/remindersList.js');

module.exports = {
    ping,
    reminder,
    help,
    list
}
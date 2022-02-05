const ping = require('../commands/ping.js');
const reminder = require('../commands/reminder.js');
const help = require('../commands/help.js');
const list = require('../commands/remindersList.js');
const timeZone = require('../commands/timezoneSetter.js');
const setTimezone = require('../commands/setTimezone.js');
const cycling = require('../commands/cycling.js');

module.exports = {
    cycling,
    setTimezone,
    timeZone,
    ping,
    reminder,
    help,
    list
}
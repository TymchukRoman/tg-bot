const { Markup } = require('telegraf')
const moment = require('moment');

module.exports = (ctx) => {
    const timeZones = [
        "Etc/GMT-14", "Etc/GMT-13", "Etc/GMT-12", "Etc/GMT-11", "Etc/GMT-10",
        "Etc/GMT-9", "Etc/GMT-8", "Etc/GMT-7", "Etc/GMT-6", "Etc/GMT-5",
        "Etc/GMT-4", "Etc/GMT-3", "Etc/GMT-2", "Etc/GMT-1", "Etc/GMT+0",
        "Etc/GMT+1", "Etc/GMT+2", "Etc/GMT+3", "Etc/GMT+4", "Etc/GMT+5",
        "Etc/GMT+6", "Etc/GMT+7", "Etc/GMT+8", "Etc/GMT+9", "Etc/GMT+10", "Etc/GMT+11", "Etc/GMT+12",
    ].map(item => {
        return String("/stz " + moment().tz(item).format("hh:mm:ss a MMM Do") + " |" + item);
    })

    return ctx.reply(
        'Choose option that contain your local time.',
        Markup.keyboard(timeZones, {
            wrap: () => 4
        }).oneTime().resize()
    )
}
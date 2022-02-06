const DB = require('../core/database');

module.exports = (ctx) => {
    try {
        const timeZone = ctx.update.message.text.split('|')[1];
        DB.setTimezone(ctx.update.message.from.id, timeZone);
        return ctx.reply(timeZone);
    } catch (err) {
        console.log(err);
    }
}
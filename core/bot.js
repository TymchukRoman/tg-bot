const { Telegraf } = require('telegraf');
const commands = require('./commandsRouter.js');
const logger = require('./logger');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(`Welcome! ${ctx.update.message.from.username} Use /help for more info.`);
    logger.log('New user', ctx.update.message.from.id, 'INFO', {
        id: ctx.update.message.from.id,
        username: ctx.update.message.from.username,
        first_name: ctx.update.message.from.first_name,
        last_name: ctx.update.message.from.last_name,
    });
});

bot.command('ping', (ctx) => {
    commands.ping(ctx);
});

bot.command('reminder', async (ctx) => {
    commands.reminder(ctx);
});

bot.command('list', (ctx) => {
    commands.list(ctx);
})

bot.command('help', (ctx) => {
    commands.help(ctx);
})

module.exports = bot;
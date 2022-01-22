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


//Use to create reminder from patterns in group chats
bot.on('inline_query', async (ctx) => {
    const patterns = [
        { type: 'article', id: 1, title: 'Reminder for 2m', input_message_content: { message_text: '/reminder 2m' } },
        { type: 'article', id: 2, title: 'Reminder for 15m', input_message_content: { message_text: '/reminder 15m' } },
        { type: 'article', id: 3, title: 'Reminder for 30m', input_message_content: { message_text: '/reminder 30m' } },
        { type: 'article', id: 4, title: 'Reminder for 1h', input_message_content: { message_text: '/reminder 1h' } },
        { type: 'article', id: 5, title: 'Reminder for 2h', input_message_content: { message_text: '/reminder 2h' } }
    ].filter((item) => item.title.includes(ctx.inlineQuery.query));

    ctx.answerInlineQuery(patterns);
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
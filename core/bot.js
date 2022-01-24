const { Telegraf } = require('telegraf');
const commands = require('./commandsRouter.js');
const DB = require('./database');

const checkUser = require('./middleware/checkUser');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(`Welcome! ${ctx.update.message.from.username} Use /help for more info.`);
    DB.createUser(ctx.update.message.from);
});

bot.use(checkUser());

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
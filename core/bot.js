const { Telegraf } = require('telegraf');
const commands = require('./commandsRouter.js');
const logger = require('./logger');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Welcome');
    console.log(JSON.stringify(ctx.update.message.from.id));
    logger.log("New user", {
        id: ctx.update.message.from.id, 
        username: ctx.update.message.from.username,
        first_name: ctx.update.message.from.first_name,
        last_name: ctx.update.message.from.last_name,
    });
});

bot.command('ping', (ctx) => {
    commands.ping(ctx);
});

bot.command('test', async (ctx) => {
    try{
        await ctx.replyWithChatAction("Where", ["Here", "There", "Then", "Jump"] );
    } catch(err){
        console.log(err);
    }
});

bot.on('text', (ctx) => {
    console.log(ctx.update.message.text);
    ctx.reply(`Your msg: ${ctx.update.message.text}`);
});

module.exports = bot;
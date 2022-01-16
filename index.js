const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'))

bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.command('oldschool', (ctx) => {
    console.log(ctx.update.message.text);
    ctx.reply('Hello')
});

bot.launch().then(() => {
    console.log("Bot started");
});

bot.on('callback_query', (ctx) => {
    // Explicit usage
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

    // Using context shortcut
    ctx.answerCbQuery()
})

bot.command('quit', (ctx) => {
    // Explicit usage
    // ctx.telegram.leaveChat(ctx.message.chat.id)

    // Using context shortcut
    // ctx.leaveChat()
})


bot.command('vid', (ctx) => {
    // resend existing file by file_id
    // ctx.replyWithSticker('123123jkbhj6b')

    // send file
    // ctx.replyWithVideo({ source: '/path/to/video.mp4' })

    // send stream
    // ctx.replyWithVideo({
        // source: fs.createReadStream('/path/to/video.mp4')
    // })

    // send buffer
    // ctx.replyWithVoice({
    //     source: Buffer.alloc()
    // })

    // send url via Telegram server
    ctx.replyWithPhoto('https://picsum.photos/200/300/?random')

    // pipe url content
    // ctx.replyWithPhoto({
    //     url: 'https://picsum.photos/200/300/?random',
    //     filename: 'kitten.jpg'
    // })
})

bot.on('text', (ctx) => {
    console.log(ctx.update.message.text);
    ctx.reply(`Your msg: ${ctx.update.message.text}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
const DB = require('../database');

const checkUser = () => async (ctx, next) => {
    if (ctx.update.message.chat.type === 'group') {
        DB.createGroup(ctx.update.message.chat);
    }

    DB.createUser(ctx.update.message.from);

    return next();
};

module.exports = checkUser;
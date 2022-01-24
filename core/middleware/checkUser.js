const DB = require('../database');

const checkUser = () => async (ctx, next) => {
    console.log(ctx.update.message)
    const user = await DB.getUser(ctx.update.message.from.id);

    if (user) return next();

    console.log("User not found");

    DB.createUser(ctx.update.message.from);

    return next();

};

module.exports = checkUser;
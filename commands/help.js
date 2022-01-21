module.exports = (ctx) => {
    const helpString = `*Commands list:*

*/reminder* 
    Usage examples: 
    /reminder 2h 3m
    /reminder 5h
    /reminder 120m

*/help* You already here)

*/ping* Check bot responsibility

*/list* Get all reminders in this chat`

    ctx.replyWithMarkdown(helpString);
} 
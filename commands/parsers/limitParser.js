module.exports = (reminderTime) => {
    let hours, minutes;
    const times = reminderTime.split(" ");
    if (times.length === 2) {
        [hours, minutes] = times;
        hours = +hours.slice(0, -1);
        minutes = +minutes.slice(0, -1);
    } else if (times[0].includes("h")) {
        hours = +times[0].slice(0, -1);
        minutes = 0;
    } else if (times[0].includes("m")) {
        hours = 0;
        minutes = +times[0].slice(0, -1);
    }
    if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
    }
    return [hours, minutes];
}
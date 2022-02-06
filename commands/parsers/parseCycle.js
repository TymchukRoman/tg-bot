const moment = require('moment');

const cycleParser = (cycleData, type, timeZone) => {
    switch (type) {
        case 'day': {

            let time = cycleData.split('day')[1].trim();
            if (!time) {
                time = "00:00";
            }
            if (time.includes("m")) {
                time = moment(time, ["h:mm A"]).format("HH:mm");
            }
            time = moment(time, ["HH:mm"])
            const localTime = moment.tz(time.format().split("+")[0], timeZone);
            time = localTime.clone().tz("Etc/GMT+0");
            time = time.format("HH:mm");

            return { period: 'day', time: time || '00:00', format: "HH:mm" };
        }
        case 'week': {

            let [period, weekday, time, dayTime] = cycleData.split(' ');

            time = [weekday, time, dayTime].join(' ').trim();
            if (!time) {
                time = "Sun 00:00";
            }
            if (time.includes("am") || time.includes("pm")) {
                time = moment(time, ["ddd h:mm A"]).format("ddd HH:mm");
            }
            time = moment(time, ["ddd HH:mm"]);
            const localTime = moment.tz(time.format().split("+")[0], timeZone);
            time = localTime.clone().tz("Etc/GMT+0").format("ddd HH:mm");

            return { period: period || 'week', weekday: weekday || 'monday', time: time || '00:00', format: "ddd HH:mm" };
        }
        case 'month': {
            let [period, monthday, time, dayTime] = cycleData.split(' ');

            time = [monthday, time, dayTime].join(' ').trim();
            if (time.includes("am") || time.includes("pm")) {
                time = moment(time, ["DD h:mm A"]).format("DD HH:mm");
            }
            if (!time) {
                time = "01 00:00";
            }
            time = moment(time, ["DD HH:mm"]);
            const localTime = moment.tz(time.format().split("+")[0], timeZone);
            time = localTime.clone().tz("Etc/GMT+0").format("DD HH:mm");

            return { period: period || 'month', monthday: monthday || '23', time: time || '00:00', format: "DD HH:mm" };
        }
        default: {
            return false;
        }
    }
}

module.exports = cycleParser;
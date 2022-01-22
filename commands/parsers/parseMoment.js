const moment = require('moment');

const formatedYear = (year) => {
    if (year.length == 2) {
        return `20${year}`
    }
    return year;
}

const formatedDouble = (value) => {
    if (value.length == 1) {
        return `0${value}`
    }
    return value;
}

module.exports = (data) => {
    const month = data.month ? formatedDouble(data.month) : formatedDouble(String(moment().month() + 1));
    const day = data.day ? formatedDouble(data.day) : formatedDouble(String(moment().date()));
    const year = data.year ? formatedYear(data.year) : formatedYear(String(moment().year()));
    const hour = data.hour ? formatedDouble(data.hour) : '00';
    const minute = data.minute ? formatedDouble(data.minute) : '00';
    const momentString = `${month} ${day} ${year} ${hour}:${minute}:00 ${data.dayTime ? data.dayTime : ''}`;
    return data.dayTime ? moment(momentString, "MM DD YYYY hh:mm:ss a") : moment(momentString, "MM DD YYYY HH:mm:ss");
}

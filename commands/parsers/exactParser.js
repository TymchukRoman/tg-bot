const parser = (reminderTime, type) => {
    switch (type) {
        case 'et': {
            let [hour, minute] = reminderTime.split(':');
            let dayTime = null;
            if (minute.toLowerCase().includes('am') || minute.toLowerCase().includes('pm')) {
                console.log(minute);
                if (minute.includes(' ')) {
                    [minute, dayTime] = minute.split(' ');
                } else {
                    dayTime = minute.length == 4 ? minute.substring(2, 4) : minute.substring(1, 3);
                    minute = minute.length == 4 ? minute.substring(0, 2) : minute.substring(0, 1);
                }
            }
            return { hour, minute, dayTime };
        }
        case 'ed': {
            let [day, month, year] = reminderTime.split(/\/|:/);
            if (month > 12 && day <= 12) {
                [day, month] = [month, day];
            }
            return { day, month, year };
        }
        case 'etd': {
            let time, temp, date;
            if (reminderTime.toLowerCase().includes(' am') || reminderTime.toLowerCase().includes(' pm')) {
                [time, temp, date] = reminderTime.split(' ');
                time = time + temp;
            } else {
                [time, date] = reminderTime.split(' ');
            }
            const { hour, minute, dayTime } = parser(time, 'et');
            const { day, month, year } = parser(date, 'ed');
            return { hour, minute, day, month, year, dayTime };
        }
        case 'edt': {
            let date, temp, time;
            if (reminderTime.toLowerCase().includes(' am') || reminderTime.toLowerCase().includes(' pm')) {
                [date, time, temp] = reminderTime.split(' ');
                time += temp;
            } else {
                [date, time] = reminderTime.split(' ');
            }
            const { hour, minute, dayTime } = parser(time, 'et');
            const { day, month, year } = parser(date, 'ed');
            return { hour, minute, day, month, year, dayTime };
        }
        default: {
            return [0, 0];
        }
    }
}

module.exports = parser;
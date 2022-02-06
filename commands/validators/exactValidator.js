const moment = require('moment');

module.exports = (firesTime, type) => {
    switch (type) {
        case 'exact time et': {
            if (moment().isSameOrAfter(firesTime)) {
                return moment(firesTime).add(1, 'days');
            }
            return firesTime;
        }
        case 'exact time ed':
        case 'exact time etd':
        case 'exact time edt': {
            if (moment().isSameOrAfter(firesTime)) {
                return false;
            }
            return firesTime;
        }
        default: {
            return false;
        }
    }
}
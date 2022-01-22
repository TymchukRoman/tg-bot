module.exports = (reminderTime, type) => {
    switch (type) {
        case 'et': {
            console.log('in -> ', reminderTime)
            const [h, m] = reminderTime.split(':');
            console.log('out -> ', h, m);
            break;
        }
        case 'ed': {
            console.log('in -> ', reminderTime)
            const [d, m, y] = reminderTime.split(/\/|:/);
            console.log('out -> ', d, m, y);
            break;
        }
        case 'etd': {

            break;
        }
        case 'edt': {

            break;
        }
        default: {
            return 0, 0;
        }
    }
}
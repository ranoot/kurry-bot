exports.processText = text => {
    switch (text) {
        case 'Is zachary ghei':
            return 'yes';
        default:
            return 'wot';
    }
};

exports.tooLate = () => {
    const sgTimeNow = new Date(Date.now() + 28800000); // add 8 hours to UTC time 
    const sgHourNow = sgTimeNow.getUTCHours();

    if (sgHourNow >= 0 && sgHourNow <= 6) {
        return true;
    } else {
        return false;
    }
};

console.log(exports.tooLate())
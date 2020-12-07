exports.processText = text => {
    switch (text) {
        case 'Is zachary ghei':
            return 'yes';
    }
};

exports.tooLate = () => {
    const sgTimeNow = new Date(Date.now() + 28800000); // add 8 hours to UTC time 
    const sgHourNow = sgTimeNow.getUTCHours();

    return (sgHourNow >= 0 && sgHourNow <= 6);
};

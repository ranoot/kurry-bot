const tooLate = () => {
    const sgTimeNow = new Date(Date.now() + 28800000); // add 8 hours to UTC time 
    const sgHourNow = sgTimeNow.getUTCHours();

    return (sgHourNow >= 0 && sgHourNow <= 6);
};

exports.processMsg = msg => {
    const regex = /is (.+) gay/;
    if (tooLate()) {
        return `<b>Bruh, please go sleep ${msg.from.first_name}</b>`;
    }
    if (msg.text.toLowerCase().includes("hello")) {
        return `Hello ${msg.from.first_name}`;
    }
    if (regex.test(msg.text.toLowerCase())) {
        return `Yes, ${msg.text.toLowerCase().match(regex)[1]} is ghei`;
    }
};


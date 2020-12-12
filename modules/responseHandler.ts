const tooLate = (): boolean => {
    const sgTimeNow = new Date(Date.now() + 28800000); // add 8 hours to UTC time 
    const sgHourNow = sgTimeNow.getUTCHours();

    return (sgHourNow >= 0 && sgHourNow <= 6);
};

const processMsg = (msg): string => {
    const regex = /is (.*\S.*) gay/;
    if (msg.text) {
        if (tooLate()) {
            return `<b>Bruh, please go sleep ${msg.from.first_name}</b>`;
        }
        if (msg.text.toLowerCase().includes("hello")) {
            return `Hello ${msg.from.first_name}`;
        }
        if (regex.test(msg.text.toLowerCase())) {
            return `Yes, ${msg.text.toLowerCase().match(regex)[1]} is ghei`;
        }
    }
};

interface Options {
    action: string;
    message?: string;
    trigger?: string;
    response?: string;
}

const parseOptions = (msgText: string): Options => {
    const [ , action, ...optionsArray ] = msgText.split(' ');
    let optionObj: Options = { action };
    for (let i = 0, arrLen = optionsArray.length; i < arrLen; i += 2) {
        const option = optionsArray[i];
        if (option.startsWith('--')) {
            optionObj[option.substring(2)] = optionsArray[i + 1];
        }
    }
    return optionObj;
};

export { processMsg, parseOptions };
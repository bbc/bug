//Time is a contruct - Converts uptime in seconds to a human readable notation

const realitiveUptime = (seconds) => {
    const secondsInt = parseInt(seconds);

    let realitiveUptime = "";

    if (secondsInt) {
        const sPerMinute = 60;
        const sPerHour = sPerMinute * 60;
        const sPerDay = sPerHour * 24;
        const sPerMonth = sPerDay * 30;
        const sPerYear = sPerDay * 365;

        if (secondsInt < sPerMinute) {
            realitiveUptime = secondsInt;
            if (realitiveUptime === 1) {
                realitiveUptime += " second ago";
            } else {
                realitiveUptime += " seconds ago";
            }
        } else if (secondsInt < sPerHour) {
            realitiveUptime = parseInt(secondsInt / sPerMinute);
            if (realitiveUptime === 1) {
                realitiveUptime += " minute ago";
            } else {
                realitiveUptime += " minutes ago";
            }
        } else if (secondsInt <= sPerDay) {
            realitiveUptime = parseInt(secondsInt / sPerHour);
            if (realitiveUptime === 1) {
                realitiveUptime += " hour ago";
            } else {
                realitiveUptime += " hours ago";
            }
        } else if (secondsInt <= sPerMonth) {
            realitiveUptime = parseInt(secondsInt / sPerDay);
            if (realitiveUptime === 1) {
                realitiveUptime += " day ago";
            } else {
                realitiveUptime += " days ago";
            }
        } else if (secondsInt <= sPerYear) {
            realitiveUptime = parseInt(secondsInt / sPerMonth);
            if (realitiveUptime === 1) {
                realitiveUptime += " month ago";
            } else {
                realitiveUptime += " months ago";
            }
        } else {
            const date = new Date().getTime() - secondsInt;
            const day = date.getDate();
            const month = date
                .toDateString()
                .match(/ [a-zA-Z]*/)[0]
                .replace(" ", "");
            const year = date.getFullYear() === date.getFullYear() ? "" : " " + date.getFullYear();
            realitiveUptime = day + " " + month + year;
        }
    }

    return realitiveUptime;
};

export default realitiveUptime;

//Time is a contruct - Converts JS date objects to sensible humnan readable notation

const realitiveTime = (dateObject) => {
    const timestamp = Date.parse(dateObject);

    let realitiveTime = "";

    if (timestamp) {
        const sPerMinute = 60;
        const sPerHour = sPerMinute * 60;
        const sPerDay = sPerHour * 24;
        const sPerMonth = sPerDay * 30;
        const sPerYear = sPerDay * 365;

        const now = new Date().getTime();
        const secondsPast = parseInt((now - timestamp) / 1000);
        if (secondsPast < sPerMinute) {
            realitiveTime = secondsPast;
            if (realitiveTime === 1) {
                realitiveTime += " second ago";
            } else {
                realitiveTime += " seconds ago";
            }
        } else if (secondsPast < sPerHour) {
            realitiveTime = parseInt(secondsPast / sPerMinute);
            if (realitiveTime === 1) {
                realitiveTime += " minute ago";
            } else {
                realitiveTime += " minutes ago";
            }
        } else if (secondsPast <= sPerDay) {
            realitiveTime = parseInt(secondsPast / sPerHour);
            if (realitiveTime === 1) {
                realitiveTime += " hour ago";
            } else {
                realitiveTime += " hours ago";
            }
        } else if (secondsPast <= sPerMonth) {
            realitiveTime = parseInt(secondsPast / sPerDay);
            if (realitiveTime === 1) {
                realitiveTime += " day ago";
            } else {
                realitiveTime += " days ago";
            }
        } else if (secondsPast <= sPerYear) {
            realitiveTime = parseInt(secondsPast / sPerMonth);
            if (realitiveTime === 1) {
                realitiveTime += " month ago";
            } else {
                realitiveTime += " months ago";
            }
        } else {
            const date = new Date(timestamp);
            const day = date.getDate();
            const month = date
                .toDateString()
                .match(/ [a-zA-Z]*/)[0]
                .replace(" ", "");
            const year = date.getFullYear() === now.getFullYear() ? "" : " " + date.getFullYear();
            realitiveTime = day + " " + month + year;
        }
    }

    return realitiveTime;
};

export default realitiveTime;

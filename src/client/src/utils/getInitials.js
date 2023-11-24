const getInitials = (name = "?") => {
    let initials = "";

    const names = name.split(" ");
    for (let item of names) {
        initials += item[0];
    }
    return initials;
};

export default getInitials;

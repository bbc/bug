import md5 from "md5";

const getGravatarUrl = (email) => {
    let hash = "";
    if (email) {
        hash = md5(email);
    }
    return `https://s.gravatar.com/avatar/${hash}?s=80&d=404`;
};

export default getGravatarUrl;

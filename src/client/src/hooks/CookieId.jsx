import { useLocation } from "react-router-dom";

const useCookieId = (id) => {
    const location = useLocation();
    let pathname = location.pathname.replace(/^\/|\/$/g, "");
    pathname = pathname.replace("/", "_");
    return `${pathname}_${id}`;
};

export { useCookieId };

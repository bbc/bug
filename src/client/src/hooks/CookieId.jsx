import { useLocation } from "react-router-dom";

const useCookieId = (id) => {
    try {
        const location = useLocation();
        let pathname = location.pathname.replace(/^\/|\/$/g, "");
        pathname = pathname.replace("/", "_");
        return `${pathname}_${id}`;
    } catch (error) {
        return "NONE";
    }
};

export { useCookieId };

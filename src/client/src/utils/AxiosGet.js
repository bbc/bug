import axios from "axios";

export default async function AxiosGet(url) {
    const response = await axios.get(url);

    switch (response.data.status) {
        case "success":
            return response.data.data;
        case "failure":
            console.error("failed to fetch " + url);
            return null;
        case "error":
            console.error(response.data.message);
            return null;
        default:
            return null;
    }
}

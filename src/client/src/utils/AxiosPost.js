import axios from "axios";

export default async function AxiosPost(url, data) {
    try {
        let response = await axios.post(url, data);
        switch (response.data.status) {
            case "success":
                response = response.data.data;
                break;
            case "failure":
                console.error("failed to fetch " + url);
                response = null;
                break;
            case "error":
                console.error(response.data.message);
                response = null;
                break;
            default:
                response = null;
        }
        return response;
    } catch (error) {
        console.log("ERROR", error);
        return false;
    }
}

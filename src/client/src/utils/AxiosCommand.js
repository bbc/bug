import axios from "axios";

export default async function AxiosCommand(url, data = null) {
    try {
        let response;
        if (data) {
            response = await axios.post(url, data);
        } else {
            response = await axios.get(url);
        }

        switch (response.data?.status) {
            case "success":
                return true;
            case "failure":
                console.error("failed to fetch " + url);
                return false;
            case "error":
                console.error(response.message);
                return false;
            default:
                return false;
        }
    } catch (error) {
        console.log("ERROR", error);
        return false;
    }
}

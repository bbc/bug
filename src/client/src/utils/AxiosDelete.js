import axios from "axios";

export default async function AxiosDelete(url, data) {
    try {
        let response = await axios.delete(url, { data });

        switch (response.data.status) {
            case "success":
                return true;
            case "failure":
                console.error("failed to DELETE " + url);
                return false;
            case "error":
                console.error(response.data.message);
                return false;
            default:
                return false;
        }
    } catch (error) {
        console.log("ERROR", error);
        return false;
    }
}

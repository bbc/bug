import axios from "axios";

export default async function AxiosPut(url, data, { includeResponse = false } = {}) {
    try {
        let response = await axios.put(url, data);

        switch (response?.data?.status) {
            case "success":
                response = includeResponse ? response.data : response?.data?.data;
                break;
            case "failure":
                console.error("failed to PUT " + url);
                response = null;
                break;
            case "error":
                console.error(response?.data?.message);
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

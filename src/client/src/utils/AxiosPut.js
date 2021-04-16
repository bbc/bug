import axios from 'axios';

export default async function AxiosPut(url,data) {

    let response = await axios.put(url,data);

    switch(response?.data?.status) {
        case 'success':
            response = response?.data?.data;
            break;
        case 'fail':
            console.error('failed to fetch ' + url);
            response = null;
            break;
        case 'error':
            console.error(response?.data?.message);
            response = null;
            break;
        default:
            response = null;
    }
    return response;
}
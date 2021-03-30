import axios from 'axios';

export default async function AxiosGet(url) {

    const response = await axios.get(url);

    switch(response.status) {
        case 'success':
            return response.data;
        case 'fail':
            console.error('failed to fetch ' + url);
            return null;
        case 'error':
            console.error(response.message);
            return null;
        default:
            return null;
    }
}
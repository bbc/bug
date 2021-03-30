import axios from 'axios';

export default async function AxiosComand(url) {

    const response = await axios.get(url);

    if(response.message) {
        alert(response.message);
    }
    switch(response.status) {
        case 'success':
            return true;
        case 'fail':
            console.error('failed to fetch ' + url);
            return false;
        case 'error':
            console.error(response.message);
            return false;
        default:
            return false;
    }
}
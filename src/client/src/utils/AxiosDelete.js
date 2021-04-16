import axios from 'axios';

export default async function AxiosDelete(url) {

    let response = await axios.delete(url);
    
    switch(response.data.status) {
        case 'success':
            response = response.data.data;
            break;
        case 'fail':
            console.error('failed to fetch ' + url);
            response = null;
            break;
        case 'error':
            console.error(response.data.message);
            response = null;
            break;
        default:
            response = null;
    }
    return response;
}
import axios from 'axios';

export default async function AxiosPost(url,data) {

    const response = await axios({
        method: 'post',
        url: url,
        data: data
    });

    switch(response.data.status) {
        case 'success':
            return response.data.data;
        case 'fail':
            console.error('failed to fetch ' + url);
            return null;
        case 'error':
            console.error(response.data.message);
            return null;
        default:
            return null;
    }
}
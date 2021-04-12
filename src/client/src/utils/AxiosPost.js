import axios from 'axios';

export default async function AxiosPost(url,data) {
    let response = {};
    try{
        response = await axios({
            method: 'post',
            url: url,
            data: data
        });

        switch(response.data.status) {
            case 'success':
                response = response.data.data;
            case 'fail':
                console.error('failed to fetch ' + url);
                response = null;
            case 'error':
                console.error(response.data.message);
                response = null;
            default:
                response = null;
        }
    }
    catch(error){
        response.error = error;
    }
    return response;
}
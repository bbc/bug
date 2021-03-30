import axios from 'axios';
import { snackActions } from '@utils/Snackbar';

export default async function AxiosComand(url) {

    const response = await axios.get(url);

    const showMessage = (response) => {
        if(!response.message) {
            return;
        }

        snackActions.toast(response.message, response.status);

    };

    showMessage(response.data);

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
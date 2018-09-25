import { APIClient } from 'lisk-elements';

export const client = () => {
    return APIClient.createMainnetAPIClient();
}


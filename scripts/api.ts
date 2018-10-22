import { APIClient } from 'lisk-elements';

export const client = () => {
    return new APIClient([
        'https://wallet.mylisk.com',
        'https://wallet.lisknode.io'
    ]);
}


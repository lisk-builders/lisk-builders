import { APIClient } from 'lisk-elements';

export const client = () => {
    return new APIClient([
        'https://node01.lisk.io',
        'https://node02.lisk.io',
        'https://node03.lisk.io',
        'https://node04.lisk.io',
        'https://node05.lisk.io',
        'https://node06.lisk.io',
        'https://node07.lisk.io',
        'https://node08.lisk.io'
    ]);
}


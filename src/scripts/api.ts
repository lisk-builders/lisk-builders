import { APIClient } from 'lisk-elements';

export const client = () => {
    return new APIClient([
        'https://node01.lisk.io/api/delegates',
        'https://node02.lisk.io/api/delegates',
        'https://node03.lisk.io/api/delegates',
        'https://node04.lisk.io/api/delegates',
        'https://node05.lisk.io/api/delegates',
        'https://node06.lisk.io/api/delegates',
        'https://node07.lisk.io/api/delegates',
        'https://node08.lisk.io/api/delegates'
    ]);
}


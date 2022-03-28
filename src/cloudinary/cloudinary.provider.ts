import { v2 } from 'cloudinary';

import { CLOUDINARY } from '../config/config.constants';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: () => {
        return v2.config({
            cloud_name: 'dqjirfzaa',
            api_key: '569949653615777',
            api_secret: 'oCe-4UAS3VunLtJmYeOrcxPE67Q',
        });
    },
};
import { v2 } from 'cloudinary';

import { CLOUDINARY } from '../config/config.constants';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: () => {
        return v2.config({
            // CDN:
            // cloud_name: 'dqjirfzaa',
            // api_key: '569949653615777',
            // api_secret: 'oCe-4UAS3VunLtJmYeOrcxPE67Q',
            // Yordano prueba
            cloud_name: 'hazhi123',
            api_key: '763473448223958',
            api_secret: 'EUiCkFPXNgM7z4tQ5pXtIwgeL64',
        });
    },
};
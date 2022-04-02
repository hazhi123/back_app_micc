import toStream = require('buffer-to-stream');
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
} from 'cloudinary';

import { Injectable } from '@nestjs/common';

@Injectable()

export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {

        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            toStream(file.buffer).pipe(upload);
        });
    }

    async deleteImage(
        file: string,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            v2.uploader.destroy(file, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
}

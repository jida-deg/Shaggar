import https from 'node:https';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

let cloudinaryTimeOffset = 0;
let offsetExpiresAt = 0;

const getCloudinaryTimestamp = () => new Promise((resolve) => {
  if (Date.now() < offsetExpiresAt) {
    return resolve(Math.floor((Date.now() + cloudinaryTimeOffset) / 1000));
  }

  const request = https.request('https://api.cloudinary.com/', (response) => {
    response.resume();
    response.once('end', () => {
      const cloudinaryDate = Date.parse(response.headers.date || '');

      if (!Number.isNaN(cloudinaryDate)) {
        cloudinaryTimeOffset = cloudinaryDate - Date.now();
        offsetExpiresAt = Date.now() + 5 * 60 * 1000;
        resolve(Math.floor(cloudinaryDate / 1000));
        return;
      }

      resolve(Math.floor(Date.now() / 1000));
    });
  });

  request.setTimeout(5000, () => request.destroy());
  request.once('error', () => resolve(Math.floor(Date.now() / 1000)));
  request.end();
});

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  };
};

export const uploadToCloudinary = (buffer, folder = 'uploads') => {
  return new Promise(async (resolve, reject) => {
    const config = getCloudinaryConfig();
    if (!config) {
      return reject(new Error('Cloudinary is not configured. Image upload skipped.'));
    }

    cloudinary.config(config);
    const timestamp = await getCloudinaryTimestamp();

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', timestamp },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = (publicId, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export default cloudinary;
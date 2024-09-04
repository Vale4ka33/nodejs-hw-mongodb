import cloudinary from 'cloudinary';
import { env } from './env.js';
import {CLOUDINARY} from '../constants/index.js';
import fs from 'fs/promises';


cloudinary.v2.config({
  secure: true,
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

export const uploadToCloudinary = async (filePath) => {
  try {
    console.log(`Uploading file to Cloudinary from path: ${filePath}`);
    const response = await cloudinary.v2.uploader.upload(filePath);
    console.log(`File uploaded successfully. Cloudinary response: ${JSON.stringify(response)}`);
    
    await fs.unlink(filePath);
    console.log(`File removed from local path: ${filePath}`);
    
    return response.secure_url;
  } catch (error) {
    console.error(`Error uploading file to Cloudinary: ${error.message}`);
    throw error;
  }
};

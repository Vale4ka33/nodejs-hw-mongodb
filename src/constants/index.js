import path from 'node:path';

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc'
};

export const FIFTEEN_MINUTES = 1000 * 60 * 15;
export const THIRTY_DAY = 1000 * 60 * 60 * 24 * 30;

export const SMTP = {
    SERVER: process.env.SMTP_SERVER,
    PORT: process.env.SMTP_PORT,
    USER: process.env.SMTP_USER,
    PASSWORD: process.env.SMTP_PASSWORD,
    FROM: process.env.SMTP_FROM
};

export const APP_DOMAIN = process.env.APP_DOMAIN;

export const CLOUDINARY = {
    CLOUD_NAME: 'CLOUD_NAME',
    API_KEY: 'API_KEY',
    API_SECRET: 'API_SECRET',
  };

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'tmp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
import { randomBytes } from 'node:crypto';
import { SessionCollection } from '../db/model/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAY } from '../constants/index.js';

export const createSession = async (userId) => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
  
    return await SessionCollection.create({
      userId,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
    });
  };
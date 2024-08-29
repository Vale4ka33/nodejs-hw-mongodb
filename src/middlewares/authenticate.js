import createHttpError from 'http-errors';
import { SessionCollection } from '../db/model/session.js';
import { UserCollection } from '../db/model/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw createHttpError(401, 'Please provide authorization header');
    }

    const [bearer, accessToken] = authorization.split(' ', 2);

    if (bearer !== 'Bearer' || !accessToken) {
      throw createHttpError(401, 'Auth header should be type of Bearer');
    }

    const session = await SessionCollection.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }
    
    if (new Date() > new Date(session.refreshTokenValidUntil)) {
      throw createHttpError(401, 'Access token is expired');
    }

    const user = await UserCollection.findById(session.userId);

    if (!user) {
      throw createHttpError(401, 'Session not found');
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

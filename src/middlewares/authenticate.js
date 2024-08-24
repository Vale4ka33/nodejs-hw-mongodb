import createHttpError from 'http-errors';
import { SessionCollection } from '../db/model/session.js';
import { UserCollection } from '../db/model/user.js';

export const authenticate = async (req, res, next) => {
  const { autorization } = req.headers;
  if (!autorization) {
    return next(createHttpError(401, 'Please provide Autorization header'));
  }

  const [bearer, accessToken] = autorization.split(' ', 2);

  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Auth header should be type of Bearer'));
  }

  const session = await SessionCollection.findOne({ accessToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    return next(createHttpError(401, 'Access token is expired'));
  }

  const user = await UserCollection.findById(session.userId);
  if(!user){
    return next(createHttpError(401, 'Session not found'));
  }

  next();
};

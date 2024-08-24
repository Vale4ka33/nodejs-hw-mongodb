import createHttpError from 'http-errors';
import { UserCollection } from '../db/model/user.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/model/session.js';
import { createSession } from '../utils/createNewSession.js';

export const registerUser = async (userData) => {
  const user = await UserCollection.findOne({ email: userData.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await UserCollection.create({
    ...userData,
    password: encryptedPassword,
  });

  return newUser;
};

export const loginUser = async (email, password) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  return await createSession(user._id);

};

export const logoutUser = async (sessionId)=> {
  await SessionCollection.deleteOne({_id: sessionId});
};

export const refreshUserSession = async ({sessionId, refreshToken})=>{
const session = await SessionCollection.findOne({
  _id: sessionId,
  refreshToken
});
if(!session){
  throw createHttpError(401, 'Session not found');
};
 if(new Date()> new Date(session.refreshTokenValidUntil)){
  throw createHttpError(401, 'Refresh token is expired');
 };

 await SessionCollection.deleteOne({_id: sessionId});
 const newSession = createSession();

 return await SessionCollection.create({
  userId: session.userId,
  ...newSession
 });
};
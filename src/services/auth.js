import createHttpError from 'http-errors';
import { UserCollection } from '../db/model/user.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/model/session.js';
import { createSession } from '../utils/createNewSession.js';
import { sendMail } from '../utils/sendMail.js';
import { APP_DOMAIN, SMTP } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';

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

  const existingSession = await SessionCollection.findOne({ userId: user._id });

  if (existingSession) {
    await SessionCollection.deleteOne({ userId: user._id });
  }

  return await createSession(user._id);
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  const { userId } = session;

  await SessionCollection.deleteOne({ _id: sessionId });

  const newSession = await createSession(userId);

  return newSession;
};

export const requestResetEmail = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' },
  );

  const templateSource = await fs.readFile(path.resolve('src/templates/reset-password-email.hbs'), {encoding: 'utf-8'});
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    resetToken
  });

  await sendMail({
    from: SMTP.FROM,
    to: email,
    subject: 'Reset your password',
    html
  });
};

export const resetPassword = async ({token, password}) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await UserCollection.findOne({_id: decoded.sub, email: decoded.email});

    if(!user){
      throw createHttpError(404, 'User not found');
    }
    
    const encryptedPassword = await bcrypt.hash(password, 10);

    await UserCollection.updateOne({_id: user._id}, {password: encryptedPassword});

    await SessionCollection.deleteMany({ userId: user._id });

  } catch (error) {
    if(error instanceof Error){
      throw createHttpError(401, 'Token is expired or invalid');
    };
    throw error;
  }
};
import createHttpError from 'http-errors';
import { UserCollection } from '../db/model/user.js';
import bcrypt from 'bcrypt';

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

    if(!isEqual){
        throw createHttpError(404, 'Unauthorized');
    }
};
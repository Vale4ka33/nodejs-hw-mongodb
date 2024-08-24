import { loginUser, logoutUser, refreshUserSession, registerUser } from '../services/auth.js';
import { setupCookie } from '../utils/setupCookie.js';

export const registerUserController = async (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(user);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user',
    data: registeredUser,
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  const session = await loginUser(email, password);

  setupCookie(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: session.accessToken,
  });
};

export const logoutUserController = async (req, res) => {
  if (res.cookie.sessionId) {
    await logoutUser(res.cookie.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();

};

export const refreshController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookie.sessionId,
    refreshToken: req.cookie.refreshToken
  });

  setupCookie(res, session);
  res.json({
    status: 200,
    message: 'Successfully refresh a session',
    data:{
      accessToken: session.accessToken
    }
  });
};
import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
  const JWT_SECRET = 'Super secure';
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSize: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return token;
};

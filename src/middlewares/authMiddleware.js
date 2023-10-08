import jwt from 'jsonwebtoken';
import db from '../config/dbConfig.js';
import { expressjwt } from 'express-jwt';

const User = db.users;

export const isSignedIn = expressjwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
});

export const withAuth = (req, res, next) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: 'Invalid Token',
      });
    }
    req.user = user;
    return next();
  });
};

export const withAuthAdmin = (req, res, next) => {
  const { adminToken } = req.cookies;
  jwt.verify(adminToken, process.env.SECRET, (err, user) => {
    if (err || !(user.role === 0)) {
      return res.status(401).json({
        message: 'Invalid Token',
      });
    }
    req.user = user;
    return next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return next();
  }
  return res.status(401).json({
    message: 'Unauthorized',
  });
};

export const isMerchant = (req, res, next) => {
  if (req.user.role === 2) {
    return next();
  }
  return res.status(401).json({
    message: 'Unauthorized',
  });
};

export const checkAuth = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });
  if (!user) {
    return res.status(401).json({
      message: 'Invalid Token',
    });
  }
  if (user.passUpdate && user.passUpdate > req.user.iat) {
    return res.status(401).json({
      message: 'Invalid Token',
    });
  }
  if (user) {
    const { id, name, email, phone, address, role } = user;
    return res.status(200).json({
      login: true,
      isAdmin: role === 0,
      isMerchant: role === 2,
      user: {
        id,
        name,
        email,
        phone,
        address,
      },
    });
  }
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: parseInt(process.env.COOKIESECURE, 10) === 1,
  });
  return res.status(401).json({
    message: 'Invalid Token',
  });
};

export const checkAuthAdmin = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
      role: 0,
    },
  });
  if (!user) {
    return res.status(401).json({
      message: 'Invalid Token',
    });
  }
  if (user.passUpdate && user.passUpdate > req.user.iat) {
    return res.status(401).json({
      message: 'Invalid Token',
    });
  }
  if (user) {
    const { id, name, email, phone, address, role } = user;
    return res.status(200).json({
      login: true,
      isAdmin: role === 0,
      isMerchant: role === 2,
      user: {
        id,
        name,
        email,
        phone,
        address,
      },
    });
  }
  res.clearCookie('adminToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: parseInt(process.env.COOKIESECURE, 10) === 1,
  });
  return res.status(401).json({
    message: 'Invalid Token',
  });
};

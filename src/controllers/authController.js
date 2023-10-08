import db from '../config/dbConfig.js';
import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mailer from '../utils/mailer.js';
import generateCode from '../utils/generateCode.js';

const User = db.users;
const Merchant = db.merchants;
const Setting = db.settings;
const Log = db.logs;

export const signUp = async (req, res) => {
  const { username, password, refferedBy, email } = req.body;

  // Validating the form
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      params: errors.array()[0].param,
    });
  }
 
  // Checking if the user trying to register already exists

  if (
    await User.findOne({
      where: {
        username,
      },
    })
  ) {
    return res.status(401).json({
      msg: 'Username Already Exists!',
    });
  }

  // Checking if the user trying to register already exists
  if (
    await User.findOne({
      where: {
        email,
      },
    })
  ) {
    return res.status(401).json({
      msg: 'Email ALready Exists!',
    });
  }

  // Generate Code
  const random = await generateCode();
  const referCode = await generateCode();

  const user = {
    username,
    email,
    refferCode: referCode,
    refferedBy,
    password,
    active: false,
    reset: random,
    role: req.body.merchant ? 2 : 1,
  };

  try {
    const data = await User.create(user);
    const site = await Setting.findOne({ where: { value: 'site' } });
    const appUrl = await Setting.findOne({ where: { value: 'appUrl' } });

    if (req.body.merchant) {
      const nanoId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
      const merId = nanoId();
      Merchant.create({
        merId,
        name: req.body.merchantName,
        email: req.body.merchantEmail,
        address: req.body.merchantAddress,
        proof: req.body.merchantProof,
        userId: data.id,
      });
    }

    const mailOptions = {
      user: data.id,
      subject: `Welcome to ${site.param1}`,
      message: `<h3>Welcome to ${site.param1}</h3><br/><p>Activate your account: <a href="${appUrl.param1}/activate/${random}">${appUrl.param1}/activate/${random}</a></p>`,
    };

    mailer(mailOptions);

    await Log.create({
      message: `New User #${data.id} with ${data.email} signed up`,
    });

    return res.status(201).send(data);
    // return res.status(201).send(data);
  } catch (err) {
    return res.status(500).json({
      error: err.msg,
    });
  }
};
export const signIn = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email || null,
      // active: true,
    },
    include: ['merchant'],
  });

  if (!user) {
    return res.status(401).send({
      msg: 'User does not exist!',
    });
  }
 
  if (user.role === 2 && !user.merchant) {
    return res.status(403).send({
      msg: 'Merchant Error! Contact Support.',
    });
  }

  if (user.role === 2 && !(user.merchant.status === 'verified')) {
    return res.status(403).send({
      msg: 'Merchant Not Verified',
    });
  }

  const matchPassword = await bcrypt.compare(req.body.password, user.password);

  if (!matchPassword) {
    return res.status(401).send({
      msg: 'Invalid password!',
    });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET, {
    expiresIn: '30d',
  });

  res.cookie('ac_token', token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.SAMESITE,
    secure: parseInt(process.env.COOKIESECURE, 10) === 1,
  });

  const { id, name, email, phone, address, role } = user;

  return res.json({
    id,
    email,
    token,
    // user: {
    //   id,
    //   email,
    //   token,
    // },
  });
};
export const activateAccount = async (req, res) => {
  if (!req.body.code) {
    return res.status(400).json({
      message: 'Fill Out Required Fields',
    });
  }

  const data = await User.findOne({ where: { reset: req.body.code } });

  if (!data) {
    return res.status(404).json({
      message: 'Invalid Code',
    });
  }

  try {
    await User.update(
      { active: true, reset: null },
      { where: { id: data.id } }
    );
    return res.json({ message: 'Account Activated' });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const signUpAdmin = async (req, res) => {
  // Validating the form
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      params: errors.array()[0].param,
    });
  }

  // Checking if the user trying to register already exists
  if (
    await User.findOne({
      where: {
        email: req.body.email,
      },
    })
  ) {
    return res.status(400).json({
      message: 'Email Exists',
    });
  }

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: 0,
    active: true,
  };

  try {
    const data = await User.create(user);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

export const signInAdmin = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
      role: 0,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: 'Wrong Credentials',
    });
  }

  const matchPassword = await bcrypt.compare(req.body.password, user.password);

  if (!matchPassword) {
    return res.status(401).json({
      message: 'Wrong Credentials',
    });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET, {
    expiresIn: '30d',
  });

  res.cookie('adminToken', token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.SAMESITE,
    secure: parseInt(process.env.COOKIESECURE, 10) === 1,
  });

  const { id, name, email, phone, address, role } = user;

  return res.json({
    user: {
      id,
      name,
      email,
      phone,
      address,
      role,
    },
  });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  const appUrl = await Setting.findOne({ where: { value: 'appUrl' } });

  if (!user) {
    return res.status(404).json({
      message: 'Enter a registered email',
    });
  }

  const randomId = uuidv4();

  if (user.reset) {
    await User.update({ reset: null }, { where: { email: req.body.email } });
  }
  await User.update({ reset: randomId }, { where: { email: req.body.email } });

  const mailOptions = {
    user: user.id,
    subject: 'Password Reset',
    html: `<p>Link to reset your password: <a href="${appUrl.param1}/reset/${randomId}">${appUrl.param1}/reset/${randomId}</a></p>`,
  };

  mailer(mailOptions);

  return res.json({
    message: 'A link to reset your password has been sent to your email',
  });
};

export const resetInit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      params: errors.array()[0].param,
    });
  }
  if (!(req.body.code && req.body.password)) {
    return res.status(400).json({
      message: 'Fill Out Required Fields',
    });
  }

  const data = await User.findOne({ where: { reset: req.body.code } });

  if (!data) {
    return res.status(404).json({
      message: 'Invalid Code',
    });
  }

  try {
    await User.update(
      { password: req.body.password, reset: null },
      { where: { id: data.id } }
    );
    return res.json({ message: 'Password Updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

export const signOut = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: process.env.SAMESITE,
    secure: parseInt(process.env.COOKIESECURE, 10) === 1,
  });
  res.json({
    message: 'User signed out',
  });
};

export const signOutAdmin = (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    sameSite: process.env.SAMESITE,
    secure: parseInt(process.env.COOKIESECURE, 10) === 1,
  });
  res.json({
    message: 'Admin signed out',
  });
};

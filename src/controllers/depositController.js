/* eslint-disable camelcase */
import sequelizeQuery from 'sequelize-query';
import db from '../config/dbConfig.js';
import mailer from '../utils/mailer.js';

const queryParser = sequelizeQuery(db);
const Deposit = db.deposits;
const User = db.users;
const Log = db.logs;

import { molliePayment } from '../utils/payments/mollie.js';
import { coinbasePayment } from '../utils/payments/coinbase.js';
import { coinPayments } from '../utils/payments/coinpayments.js';
import { paypalPayment } from '../utils/payments/paypal.js';
import { addBalance } from '../utils/wallet.js';
import { stripePayment } from '../utils/payments/stripe.js';
import { coingatePayment } from '../utils/payments/coingate.js';
import { paystackPayment } from '../utils/payments/paystack.js';
import { voguePayment } from '../utils/payments/voguepay.js';

export async function getAllDeposits(req, res) {
  const query = queryParser.parse(req);
  try {
    const data = await Deposit.findAll({
      ...query,
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
    });
    const count = await Deposit.count({
      ...query,
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getDepositById(req, res) {
  const { id } = req.params;
  const query = queryParser.parse(req);
  try {
    const data = await Deposit.findByPk(id, {
      ...query,
      where: {
        userId: req.user.id,
        ...query.where,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getDepositByIdAdmin(req, res) {
  const { id } = req.params;
  const query = queryParser.parse(req);
  try {
    const data = await Deposit.findByPk(id, {
      ...query,
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getAllDepositsByUser(req, res) {
  const { id } = req.user;
  const query = queryParser.parse(req);
  try {
    const data = await Deposit.findAll({
      ...query,
      where: {
        userId: id,
        ...query.where,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
    });
    const count = await Deposit.count({
      ...query,
      where: {
        userId: id,
        ...query.where,
      },
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createDeposit(req, res) {
  const { id } = req.user;
  const { payment_method, amount, currency } = req.body;
  const user = await User.findByPk(id);
  try {
    let returnedObj;

    const data = await Deposit.create({
      payment_method,
      amount,
      userId: id,
      currency,
    });

    if (payment_method === 'mollie') {
      const payment = await molliePayment(amount, data.id, currency);
      // eslint-disable-next-line no-underscore-dangle
      returnedObj = {
        ...data.dataValues,
        redirect: payment._links.checkout.href,
      };
    } else if (payment_method === 'coinbase') {
      const payment = await coinbasePayment(amount, data.id, currency);
      returnedObj = { ...data.dataValues, redirect: payment.hosted_url };
    } else if (payment_method === 'paypal') {
      const payment = await paypalPayment(amount, data.id, currency);
      returnedObj = { ...data.dataValues, redirect: payment };
    } else if (payment_method === 'stripe') {
      const payment = await stripePayment(
        amount,
        data.id,
        currency.toLowerCase()
      );
      returnedObj = { ...data.dataValues, redirect: payment };
    } else if (payment_method === 'coinpayments') {
      const payment = await coinPayments(
        { symbol: currency, amount, id: data.id },
        user
      );
      returnedObj = { ...data.dataValues, redirect: payment.checkout_url };
    } else if (payment_method === 'coingate') {
      const payment = await coingatePayment(amount, data.id, currency);
      returnedObj = { ...data.dataValues, redirect: payment };
    } else if (payment_method === 'paystack') {
      const payment = await paystackPayment(data, user);
      returnedObj = { ...data.dataValues, redirect: payment };
    } else if (payment_method === 'voguepay') {
      const payment = await voguePayment(data, user);
      returnedObj = { ...data.dataValues, redirect: payment };
    }

    await Log.create({
      message: `User #${id} requested deposit of ${amount} ${currency} via ${payment_method}`,
    });
    return res.json(returnedObj);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function acceptDeposit(req, res) {
  const { id } = req.params;
  try {
    const num = await Deposit.update({ status: 'success' }, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      const data = await Deposit.findByPk(id);
      await addBalance(data.amount, data.currency, data.userId);
      await Log.create({
        message: `Admin #${req.user.id} accepted deposit #${id}`,
      });
      mailer({
        user: data.userId,
        subject: 'Deposit Accepted',
        message: `Your deposit of ${data.amount} ${data.currency} is successful and added to your account`,
      });
      return res.json({ message: 'Deposit Succeed' });
    }
    return res.status(500).json({ message: 'Could not update deposit' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function declineDeposit(req, res) {
  const { id } = req.params;
  try {
    const data = await Deposit.findByPk(id);
    const num = await Deposit.update({ status: 'failed' }, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      await Log.create({
        message: `Admin #${req.user.id} declined deposit #${id}`,
      });
      return res.json({ message: 'Deposit Failed' });
    }
    mailer({
      user: data.userId,
      subject: 'Deposit Declined',
      message: `Your deposit of ${data.amount} ${data.currency} declined`,
    });
    return res.status(500).json({ message: 'Could not update deposit' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

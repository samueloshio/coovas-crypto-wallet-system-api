/* eslint-disable camelcase */
import sequelizeQuery from 'sequelize-query';
import db from '../config/dbConfig.js';
import mailer from '../utils/mailer.js';

const queryParser = sequelizeQuery(db);
const Exchange = db.exchanges;
const Log = db.logs;
const Setting = db.settings;
const Currency = db.currencies;
const Wallet = db.wallets;

import { addBalance, removeBalance } from '../utils/wallet.js';

export async function getAllExchanges(req, res) {
  const query = await queryParser.parse(req);
  try {
    const data = await Exchange.findAll({
      ...query,
      include: ['user'],
    });
    const count = await Exchange.count({
      ...query,
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getExchangeById(req, res) {
  const { id } = req.params;
  const query = await queryParser.parse(req);
  try {
    const data = await Exchange.findByPk(id, {
      ...query,
      where: {
        userId: req.user.id,
        ...query.where,
      },
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getExchangeByIdAdmin(req, res) {
  const { id } = req.params;
  const query = await queryParser.parse(req);
  try {
    const data = await Exchange.findByPk(id, {
      ...query,
      include: ['user'],
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getAllExchangesByUser(req, res) {
  const { id } = req.user;
  const query = await queryParser.parse(req);
  try {
    const data = await Exchange.findAll({
      ...query,
      where: {
        userId: id,
        ...query.where,
      },
    });
    const count = await Exchange.count({
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

export async function createExchange(req, res) {
  const { id } = req.user;
  const { from, to, amountFrom } = req.body;
  try {
    const currencyFrom = await Currency.findOne({ where: { symbol: from } });
    const currencyTo = await Currency.findOne({ where: { symbol: to } });
    const fromPriceUsd = currencyFrom.rateUsd;
    const toPriceUsd = currencyTo.rateUsd;
    const cryptoCondition = currencyTo.crypto || currencyFrom.crypto;
    const exchangeRate = cryptoCondition
      ? fromPriceUsd / toPriceUsd
      : toPriceUsd / fromPriceUsd;
    const adjustments = await Setting.findOne({
      where: { value: 'adjustments' },
    });
    const amountTo = amountFrom * exchangeRate;
    const fee = amountTo * (parseFloat(adjustments.param1, 10) / 100);
    const total = amountTo - fee;

    const wallet = await Wallet.findOne({
      where: { userId: id, currency: from },
    });
    if (!wallet || wallet.balance < amountFrom) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    await removeBalance(amountFrom, from, id);
    const data = await Exchange.create({
      userId: id,
      from,
      to,
      exchangeRate,
      amountFrom,
      amountTo,
      fee,
      total,
    });

    await Log.create({
      message: `User #${id} requested exchange of ${amountFrom} ${from} to ${amountTo} ${to}`,
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function acceptExchange(req, res) {
  const { id } = req.params;
  try {
    const exchange = await Exchange.findOne({ where: { id } });
    const num = await Exchange.update({ status: 'success' }, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      await addBalance(exchange.total, exchange.to, exchange.userId);
      await Log.create({
        message: `Admin #${req.user.id} accepted Exchange #${id}`,
      });
      return res.json({ message: 'Exchange Succeed' });
    }
    mailer({
      user: exchange.userId,
      subject: 'Exchange Accepted',
      message: `Your exchange request of ${exchange.amountFrom} ${exchange.from} to ${exchange.total} ${exchange.to} has been accepted`,
    });

    return res.status(500).json({ message: 'Could not update exchange' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function declineExchange(req, res) {
  const { id } = req.params;
  try {
    const exchange = await Exchange.findOne({ where: { id } });
    const num = await Exchange.update({ status: 'failed' }, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      await addBalance(exchange.amountFrom, exchange.from, exchange.userId);
      await Log.create({
        message: `Admin #${req.user.id} declined Exchange #${exchange.id}`,
      });
      return res.json({ message: 'Exchange Failed' });
    }
    mailer({
      user: exchange.userId,
      subject: 'Exchange Declined',
      message: `Your exchange request #${exchange.id} has been declined`,
    });

    return res.status(500).json({ message: 'Could not update exchange' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

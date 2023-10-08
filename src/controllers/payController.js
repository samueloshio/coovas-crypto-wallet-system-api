import sequelizeQuery from 'sequelize-query';
import { customAlphabet } from 'nanoid';
import db from '../config/dbConfig.js';
import mailer from '../utils/mailer.js';
import { addBalance, removeBalance } from '../utils/wallet.js';

const queryParser = sequelizeQuery(db);
const Pay = db.pays;
const Request = db.requests;
const Merchant = db.merchants;
const Log = db.logs;
const User = db.users;
const Wallet = db.wallets;

export async function getAllPays(req, res) {
  const query = await queryParser.parse(req);
  try {
    const data = await Pay.findAll({
      ...query,
      include: ['user'],
    });
    const count = await Pay.count({
      ...query,
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getAllPaysByUser(req, res) {
  const query = await queryParser.parse(req);
  try {
    const data = await Pay.findAll({
      ...query,
      where: {
        ...query.where,
        userId: req.user.id,
      },
    });
    const count = await Pay.count({
      ...query,
      where: {
        ...query.where,
        userId: req.user.id,
      },
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getPaysByTrxId(req, res) {
  const { trxId } = req.params;
  try {
    const data = await Pay.findOne({
      where: { trxId, userId: req.user.id },
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createPays(req, res) {
  const { id } = req.user;
  const { amount, currency, merchantId } = req.body;

  try {
    const user = await User.findOne({ where: { id } });
    const merchant = await Merchant.findOne({ where: { merId: merchantId } });
    const nanoId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);
    const trxId = nanoId();

    const wallet = await Wallet.findOne({ where: { userId: id, currency } });

    if (!wallet) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    if (!(wallet.balance >= amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const receivingUser = await User.findOne({ where: { id: merchant.userId } });

    if (receivingUser) {
      await addBalance(amount, currency, receivingUser.id);
      await removeBalance(amount, currency, id);
    } else {
      return res.status(400).json({ message: 'Merchant not found' });
    }

    const data = await Request.create({
      status: 'success',
      amount,
      currency,
      customer: user.email,
      trxId,
      merchantId: merchant.id,
    });

    await Pay.create({
      status: 'success',
      amount,
      currency,
      merchant: merchant.name,
      trxId,
      userId: req.user.id,
    });

    mailer({
      user: id,
      subject: `Payment Sent to ${merchant.name}`,
      message: `Merchant: ${merchant.name} <br/>
      Amount: ${data.amount} ${data.currency} <br/>
      TRX ID: ${data.trxId}`,
    });

    mailer({
      email: merchant.email,
      subject: 'New Payment Received',
      message: `User: ${user.email} <br/>
      Amount: ${data.amount} ${data.currency} <br/>
      TRX ID: ${data.trxId}`,
    });

    await Log.create({ message: `User #${user.id} paid ${data.amount} ${data.currency} to Merchant #${merchant.id}` });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
export async function createPaysByTrx(req, res) {
  const { id } = req.user;
  const { trxIdCheckout } = req.body;

  try {
    const user = await User.findOne({ where: { id } });
    const request = await Request.findOne({ where: { trxId: trxIdCheckout }, include: ['merchant'] });
    const merchant = await Merchant.findOne({ where: { merId: request.merchant.merId } });

    const wallet = await Wallet.findOne({ where: { userId: id, currency: request.currency } });

    if (!wallet) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    if (!(wallet.balance >= request.amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const receivingUser = await User.findOne({ where: { id: merchant.userId } });

    if (receivingUser) {
      await addBalance(request.amount, request.currency, receivingUser.id);
      await removeBalance(request.amount, request.currency, id);
    } else {
      return res.status(400).json({ message: 'Merchant not found' });
    }

    await Request.update({
      status: 'success',
    }, { where: { trxId: trxIdCheckout } });

    const data = await Pay.create({
      status: 'success',
      amount: request.amount,
      currency: request.currency,
      merchant: merchant.name,
      trxId: trxIdCheckout,
      userId: req.user.id,
    });

    mailer({
      user: id,
      subject: `Payment Sent to ${merchant.name}`,
      message: `Merchant: ${merchant.name} <br/>
      Amount: ${data.amount} ${data.currency} <br/>
      TRX ID: ${data.trxId}`,
    });

    mailer({
      email: merchant.email,
      subject: 'New Payment Received',
      message: `User: ${user.email} <br/>
      Amount: ${data.amount} ${data.currency} <br/>
      TRX ID: ${data.trxId}`,
    });

    await Log.create({ message: `User #${user.id} paid ${data.amount} ${data.currency} to Merchant #${merchant.id}` });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deletePays(req, res) {
  const { id } = req.params;

  try {
    const num = await Pay.destroy({ where: { id } });
    const ifDeleted = parseInt(num, 10);
    if (ifDeleted === 1) {
      return res.json({ message: 'Pay Deleted' });
    }
    return res.status(500).json({ message: 'Cannot delete pay' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

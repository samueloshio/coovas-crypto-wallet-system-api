import sequelizeQuery from 'sequelize-query';
import { customAlphabet } from 'nanoid';
import db from '../config/dbConfig.js';
import mailer from '../utils/mailer.js';

import { addBalance, removeBalance } from '../utils/wallet.js';

const queryParser = sequelizeQuery(db);
const Transfer = db.transfers;
const User = db.users;
const Log = db.logs;
const Wallet = db.wallets;

export async function getAllTransfers(req, res) {
  const query = queryParser.parse(req);
  try {
    const data = await Transfer.findAll({
      ...query,
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      }],
    });
    const count = await Transfer.count({
      ...query,
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getAllTransfersByUser(req, res) {
  const { id } = req.user;
  const query = queryParser.parse(req);
  try {
    const data = await Transfer.findAll({
      ...query,
      where: {
        userId: id,
        ...query.where,
      },
      include: [{
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      }],
    });
    const count = await Transfer.count({
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

export async function createTransfer(req, res) {
  const { id } = req.user;
  const { amount, currency, email } = req.body;

  try {
    const nanoId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);
    const trxId = nanoId();

    const sendingUser = await User.findByPk(id);

    const wallet = await Wallet.findOne({ where: { userId: id, currency } });

    if (!sendingUser.kyc) {
      return res.status(403).json({ message: 'Please verify KYC to debit from account' });
    }

    if (!wallet) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    if (!(wallet.balance >= amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const receivingUser = await User.findOne({ where: { email } });

    if (receivingUser) {
      await addBalance(amount, currency, receivingUser.id);
      await removeBalance(amount, currency, id);
    } else {
      return res.status(400).json({ message: 'User not found' });
    }

    const data = await Transfer.create({
      type: 'send',
      amount,
      currency,
      email,
      trxId,
      userId: id,
    });

    await Transfer.create({
      type: 'receive',
      amount,
      currency,
      email: sendingUser.email,
      trxId,
      userId: receivingUser.id,
    });

    mailer({
      user: id,
      subject: 'Send Transfer',
      message: `You sent ${data.amount} ${data.currency} to ${data.email}`,
    });

    mailer({
      user: receivingUser.id,
      subject: 'Received Transfer',
      message: `You received ${data.amount} ${data.currency} from ${sendingUser.email}`,
    });

    await Log.create({ message: `User #${id} transferred ${amount} ${currency} to User #${receivingUser.id}` });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

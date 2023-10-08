import sequelizeQuery from 'sequelize-query';
import db from '../config/dbConfig.js';
import mailer from '../utils/mailer.js';

const queryParser = sequelizeQuery(db);
const Withdraw = db.withdraws;
const User = db.users;
const Log = db.logs;
const Wallet = db.wallets;
const Linked = db.linkeds;
const Method = db.methods;

import { addBalance, removeBalance } from '../utils/wallet.js';

export async function getAllWithdraws(req, res) {
  const query = await queryParser.parse(req);
  try {
    const data = await Withdraw.findAll({
      ...query,
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
    });
    const count = await Withdraw.count({
      ...query,
      where: {
        ...query.where,
      },
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getWithdrawById(req, res) {
  const { id } = req.params;
  const query = await queryParser.parse(req);
  try {
    const data = await Withdraw.findByPk(id, {
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

export async function getWithdrawByIdAdmin(req, res) {
  const { id } = req.params;
  const query = await queryParser.parse(req);
  try {
    const data = await Withdraw.findByPk(id, {
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

export async function getAllWithdrawsByUser(req, res) {
  const { id } = req.user;
  const query = await queryParser.parse(req);
  try {
    const data = await Withdraw.findAll({
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
    const count = await Withdraw.count({
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

export async function createWithdraw(req, res) {
  const { id } = req.user;
  const { methodId, amount, currency } = req.body;
  try {
    const user = await User.findByPk(id);
    const wallet = await Wallet.findOne({ where: { currency, userId: id } });
    const method = await Method.findByPk(methodId);
    const linkedAcc = await Linked.findOne({ where: { methodId, userId: id } });

    let percentageCharge = 0;

    if (!user.kyc) {
      return res
        .status(403)
        .json({ message: 'Please verify KYC to debit from account' });
    }

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        message: 'Insufficient balance',
      });
    }

    if (method.minAmount > amount) {
      return res.status(400).json({
        message: `Minimum withdrawal is ${method.minAmount} ${method.currency}`,
      });
    }
    if (method.maxAmount < amount) {
      return res.status(400).json({
        message: `Maximum withdrawal is ${method.minAmount} ${method.currency}`,
      });
    }

    if (!linkedAcc) {
      return res.status(400).json({
        message: `Connect your ${method?.name} - ${method?.currency} account first from linked accounts`,
      });
    }

    if (method.percentageCharge) {
      percentageCharge = amount * (method.percentageCharge / 100);
    }

    const fee = percentageCharge + method.fixedCharge;

    const calculateAmount = amount - fee;

    const data = await Withdraw.create({
      method: method.name,
      params: linkedAcc.params,
      amount,
      currency,
      fee,
      total: calculateAmount,
      userId: id,
    });
    await Log.create({
      message: `User #${id} requested withdrawal of ${amount} ${currency}`,
    });
    await removeBalance(amount, currency, id);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function acceptWithdraw(req, res) {
  const { id } = req.params;
  try {
    const data = await Withdraw.findByPk(id);
    const num = await Withdraw.update(
      { status: 'success', params: data.params },
      { where: { id } }
    );
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      mailer({
        user: data.userId,
        subject: `Withdraw ${data.id} Accepted`,
        message: `Your withdraw request of ${data.total} ${data.currency} has been accepted and sent to your ${data.method}`,
      });
      await Log.create({
        message: `Admin #${req.user.id} accepted withdrawal #${id}`,
      });
      return res.json({ message: 'Withdraw Accepted' });
    }
    return res.status(500).json({ message: 'Could not update withdraw' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function declineWithdraw(req, res) {
  const { id } = req.params;
  try {
    const dataWithdraw = await Withdraw.findByPk(id);
    const num = await Withdraw.update(
      { status: 'failed', params: dataWithdraw.params },
      { where: { id } }
    );
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      const data = await Withdraw.findByPk(id);
      await addBalance(data.amount, data.currency, data.userId);
      mailer({
        user: data.userId,
        subject: `Withdraw ${data.id} Declined`,
        message: `Your withdraw request of ${data.total} ${data.currency} has been declined and balance reversed to your wallet`,
      });
      await Log.create({
        message: `Admin #${req.user.id} declined withdrawal #${id}`,
      });
      return res.json({ message: 'Withdraw Declined' });
    }
    return res.status(500).json({ message: 'Could not update withdraw' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

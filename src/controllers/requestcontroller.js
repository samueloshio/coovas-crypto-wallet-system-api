import sequelizeQuery from 'sequelize-query';
import { customAlphabet } from 'nanoid';
import db from '../config/dbConfig.js';
import mailer from '../utils/mailer.js';

const queryParser = sequelizeQuery(db);
const Request = db.requests;
const Merchant = db.merchants;
const Log = db.logs;
const Setting = db.settings;

export async function getAllRequests(req, res) {
  const query = await queryParser.parse(req);
  try {
    const data = await Request.findAll({
      ...query,
      include: ['merchant'],
    });
    const count = await Request.count({
      ...query,
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getAllRequestsByMerchant(req, res) {
  const query = await queryParser.parse(req);
  try {
    const merchant = await Merchant.findOne({ where: { userId: req.user.id } });
    const data = await Request.findAll({
      ...query,
      where: {
        ...query.where,
        merchantId: merchant.id,
      },
      include: ['merchant'],
    });
    const count = await Request.count({
      ...query,
      where: {
        ...query.where,
        merchantId: merchant.id,
      },
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getRequestById(req, res) {
  const { id } = req.params;
  try {
    const data = await Request.findByPk(id, {
      include: ['merchant'],
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getRequestByTrxId(req, res) {
  const { trxId } = req.params;
  try {
    const data = await Request.findOne({
      where: { trxId },
      include: ['merchant'],
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createRequest(req, res) {
  const { id } = req.user;
  const { amount, currency, email } = req.body;

  try {
    const merchant = await Merchant.findOne({ where: { userId: id } });
    const nanoId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);
    const trxId = nanoId();

    const appUrl = await Setting.findOne({ where: { value: 'appUrl' } });

    const data = await Request.create({
      amount,
      currency,
      customer: email,
      trxId,
      merchantId: merchant.id,
    });

    mailer({
      email,
      subject: `Payment Request from ${merchant.name}`,
      message: `Merchant: ${merchant.name} <br/>
      Amount: ${data.amount} ${data.currency} <br/>
      Payment Link: ${appUrl.param1}/checkout?trx=${data.trxId}`,
    });

    await Log.create({ message: `Merchant ${merchant.id} requested ${data.amount} ${data.currency} from ${email}` });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteRequest(req, res) {
  const { id } = req.params;

  try {
    const num = await Request.destroy({ where: { id } });
    const ifDeleted = parseInt(num, 10);
    if (ifDeleted === 1) {
      return res.json({ message: 'Request Deleted' });
    }
    return res.status(500).json({ message: 'Cannot delete request' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

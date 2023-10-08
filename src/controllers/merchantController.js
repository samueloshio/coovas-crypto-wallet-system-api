import db from '../config/dbConfig.js';
import { customAlphabet } from 'nanoid';
import sequelizeQuery from 'sequelize-query';

const queryParser = sequelizeQuery(db);
const Merchant = db.merchants;
const User = db.users;

export const getAllMerchants = async (req, res) => {
  const query = queryParser.parse(req);
  try {
    const data = await Merchant.findAll({
      ...query,
      include: ['user'],
      where: {
        ...query.where,
      },
    });
    const count = await Merchant.count({
      ...query,
      where: {
        ...query.where,
      },
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMerchantById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Merchant.findByPk(id, {
      include: ['user'],
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createMerchant = async (req, res) => {
  const nanoId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
  const merId = nanoId();
  const { userId } = req.body;
  try {
    const data = await Merchant.create({ merId, ...req.body });
    await User.update({ role: 2 }, { where: { id: userId } });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateMerchant = async (req, res) => {
  const { id } = req.user;

  try {
    const updateObj = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
    };
    const num = await Merchant.update(updateObj, { where: { userId: id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'Merchant Store Updated' });
    }
    return res.status(500).json({ message: 'Cannot update merchant store' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateMerchantAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const updateObj = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      status: req.body.status,
    };
    const num = await Merchant.update(updateObj, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'Merchant Store Updated' });
    }
    return res.status(500).json({ message: 'Cannot update merchant store' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteMerchant = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Merchant.findByPk(id);
    const num = await Merchant.destroy({ where: { id } });
    User.update({ role: 1 }, { where: { id: data.userId } });
    const ifDeleted = parseInt(num, 10);
    if (ifDeleted === 1) {
      return res.json({ message: `User Deleted with id=${id}` });
    }
    return res
      .status(500)
      .json({ message: `Cannot delete User with id=${id}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

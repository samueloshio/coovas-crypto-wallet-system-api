import sequelizeQuery from 'sequelize-query';
import db from '../config/dbConfig.js';

const queryParser = sequelizeQuery(db);
const User = db.users;

export async function getAllUsers(req, res) {
  const query = await queryParser.parse(req);
  try {
    const data = await User.findAll({
      ...query,
      where: {
        ...query.where,
      },
      attributes: { exclude: ['password'] },
    });
    const count = await User.count({
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

export async function getUserDetails(req, res) {
  const { id } = req.user;
  try {
    const data = await User.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
      include: ['merchant'],
    });
    const referCount = await User.count({ where: { refferedBy: id } });
    return res.json({ ...data.dataValues, referCount });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const data = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: ['merchant'],
    });
    const referCount = await User.count({ where: { refferedBy: id } });
    return res.json({ ...data.dataValues, referCount });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function countUsers(req, res) {
  try {
    const data = await User.count({
      where: {
        role: 1,
      },
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function updateUserAdmin(req, res) {
  const { id } = req.params;

  try {
    const updateObj = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      password: req.body.password,
      role: req.body.role,
      active: req.body.active,
      kyc: req.body.kyc,
      passUpdate: req.body.password ? Math.floor(Date.now() / 1000) : undefined,
    };
    const num = await User.update(updateObj, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'User Updated' });
    }
    return res.status(500).json({ message: 'Cannot update user' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function updateUser(req, res) {
  const { id } = req.user;

  try {
    const updateObj = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      password: req.body.password,
      passUpdate: req.body.password ? Math.floor(Date.now() / 1000) : undefined,
    };
    const num = await User.update(updateObj, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'User Updated' });
    }
    return res.status(500).json({ message: 'Cannot update user' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const num = await User.destroy({ where: { id } });
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
}

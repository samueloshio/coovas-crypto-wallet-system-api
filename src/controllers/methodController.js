import sequelizeQuery from 'sequelize-query';
import db from '../config/dbConfig.js';

const queryParser = sequelizeQuery(db);

const Method = db.methods;

export async function getAllMethods(req, res) {
  const query = await queryParser.parse(req);
  try {
    const data = await Method.findAll({
      ...query,
      where: req.user.role === 0 ? {} : { active: true },
    });
    const count = await Method.count({
      ...query,
      where: req.user.role === 0 ? {} : { active: true },
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getMethodById(req, res) {
  const { id } = req.params;
  const query = await queryParser.parse(req);
  try {
    const data = await Method.findByPk(id, {
      ...query,
      where: req.user.role === 0 ? {} : { active: true },
    });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createMethod(req, res) {
  try {
    const data = await Method.create(req.body);
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function updateMethod(req, res) {
  const { id } = req.params;
  try {
    const num = await Method.update(req.body, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'Method Updated' });
    }
    return res.status(500).json({ message: 'Cannot update method' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function deleteMethod(req, res) {
  const { id } = req.params;
  try {
    const num = await Method.destroy({ where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'Method Deleted' });
    }
    return res.status(500).json({ message: 'Cannot delete method' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

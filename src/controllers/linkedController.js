import sequelizeQuery from 'sequelize-query';
import db from '../config/dbConfig.js';

const queryParser = sequelizeQuery(db);

const Linked = db.linkeds;

export async function getUserLinkeds(req, res) {
  const query = queryParser.parse(req);
  try {
    const data = await Linked.findAll({
      ...query,
      where: { userId: req.user.id },
      include: ['method'],
    });
    const count = await Linked.count({
      ...query,
      where: { userId: req.user.id },
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createLinked(req, res) {
  try {
    const data = await Linked.create({ ...req.body, userId: req.user.id });
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function deleteLinked(req, res) {
  const { id } = req.params;
  try {
    const num = await Linked.destroy({ where: { id, userId: req.user.id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'Linked Account Removed' });
    }
    return res.status(500).json({ message: 'Cannot remove linked account' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

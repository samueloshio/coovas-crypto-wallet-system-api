import sequelizeQuery from 'sequelize-query';
import db from '../config/dbConfig.js';

const queryParser = sequelizeQuery(db);

const User = db.users;
const Kyc = db.kycs;

export async function getAllKyc(req, res) {
  const query = queryParser.parse(req);
  try {
    const data = await Kyc.findAll({
      ...query,
      include: ['user'],
    });
    const count = await Kyc.count({
      ...query,
    });
    return res.json({ count, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getKycByUser(req, res) {
  try {
    const data = await Kyc.findOne({
      where: { userId: req.user.id },
    });
    if (data) {
      return res.json(data);
    }
    return res.json({ message: 'Not Yet Submitted' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function getKycByUserId(req, res) {
  try {
    const data = await Kyc.findOne({
      where: { userId: req.params.id },
      include: ['user'],
    });
    if (data) {
      return res.json(data);
    }
    return res.json({ message: 'Not Yet Submitted' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function createKyc(req, res) {
  try {
    await Kyc.create({
      type: req.body.type,
      front: req.files.front ? req.files.front[0].filename : undefined,
      back: req.files.back ? req.files.back[0].filename : undefined,
      selfie: req.files.selfie ? req.files.selfie[0].filename : undefined,
      status: 'submitted',
      userId: req.user.id,
    });
    return res.json({ message: 'KYC Submitted' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
export async function resubmitKyc(req, res) {
  try {
    await Kyc.destroy({
      where: { userId: req.user.id },
    });
    return res.json({ message: 'You can submit KYC now' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function acceptKyc(req, res) {
  const { id } = req.params;

  try {
    const data = await Kyc.findByPk(id);
    await User.update({ kyc: true }, { where: { id: data.userId } });
    const num = await Kyc.update({ status: 'accepted' }, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'KYC Accepted' });
    }
    return res.status(500).json({ message: 'Cannot Accept KYC' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function declineKyc(req, res) {
  const { id } = req.params;

  try {
    const data = await Kyc.findByPk(id);
    await User.update({ kyc: false }, { where: { id: data.userId } });
    const num = await Kyc.update({ status: 'declined' }, { where: { id } });
    const ifUpdated = parseInt(num, 10);
    if (ifUpdated === 1) {
      return res.json({ message: 'KYC Declined' });
    }
    return res.status(500).json({ message: 'Cannot Decline KYC' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

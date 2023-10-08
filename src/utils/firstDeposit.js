/* eslint-disable camelcase */
import db from '../config/dbConfig.js';
import mailer from './mailer.js';
import { addBalance } from './wallet.js';

const Deposit = db.deposits;
const User = db.users;
const Log = db.logs;
const Setting = db.settings;

export async function firstDeposit(id) {
  const data = await Deposit.findByPk(id);
  const user = await User.findByPk(data.userId);
  const firstDeposit = await Deposit.findAll({
    where: { userId: data.userId },
  });

  const refferal = await Setting.findOne({ where: { value: 'refferal' } });
  if (firstDeposit.length === 1) {
    const referData = await User.findOne({ where: { id: user.refferedBy } });
    if (referData) {
      addBalance(refferal.param1, refferal.param2, referData.id);
      await Log.create({
        message: `User #${referData.id} rewarded ${refferal.param1} ${refferal.param2} for reffering User #${data.userId}`,
      });
    }
    mailer({
      user: referData.id,
      subject: 'Refferal Reward Received',
      message: `Your received ${refferal.param1} ${refferal.param2} for reffering user${data.userId}`,
    });
  }
}

import db from '../config/dbConfig.js';

const Wallet = db.wallets;

export const addBalance = async (amount, currency, userId) => {
  let result;
  let error;
  try {
    const data = await Wallet.findOne({ where: { userId, currency } });
    if (data) {
      const newBalance = data.balance + amount;
      await Wallet.update(
        { balance: newBalance },
        { where: { userId, currency } }
      );
    } else {
      await Wallet.create({ balance: amount, currency, userId });
    }
    result = 'Balance Updated';
  } catch (err) {
    error = err.message;
  }
  return { result, error };
};

export const removeBalance = async (amount, currency, userId) => {
  let result;
  let error;
  try {
    const data = await Wallet.findOne({ where: { userId, currency } });
    if (data) {
      const newBalance = data.balance - amount;
      await Wallet.update(
        { balance: newBalance },
        { where: { userId, currency } }
      );
    }
    result = 'Balance Updated';
  } catch (err) {
    error = err.message;
  }
  return { result, error };
};

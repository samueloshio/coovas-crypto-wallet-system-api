import db from '../config/dbConfig.js';

const Wallet = db.wallets;
const Currency = db.currencies;

export async function getWallet(req, res) {
  try {
    const wallet = [];
    const data = await Wallet.findAll({ where: { userId: req.user.id } });
    const currencies = await Currency.findAll({ where: { active: true } });
    await currencies.forEach((item) => {
      const balance = data.find((x) => x.currency === item.symbol);
      wallet.push({
        balance: balance?.balance || 0.0,
        currency: item.symbol,
        icon: item.icon,
      });
    });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

export async function getWalletByUserId(req, res) {
  try {
    const wallet = [];
    const data = await Wallet.findAll({ where: { userId: req.params.userId } });
    const currencies = await Currency.findAll({ where: { active: true } });
    await currencies.forEach((item) => {
      const balance = data.find((x) => x.currency === item.symbol);
      wallet.push({
        balance: balance?.balance || 0.0,
        currency: item.symbol,
        icon: item.icon,
      });
    });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

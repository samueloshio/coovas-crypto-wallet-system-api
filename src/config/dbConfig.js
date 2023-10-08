import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// IMPORT MODELS
import { userModel } from '../models/userModel.js';
import { merchantModel } from '../models/merchantModel.js';
import { settingsModel } from '../models/settingsModel.js';
import { logsModel } from '../models/logsModel.js';
import { gatewayModel } from '../models/gatewayModel.js';
import { depositModel } from '../models/depositModel.js';
import { exchangeModel } from '../models/exchangeModel.js';
import { transferModel } from '../models/transferModel.js';
import { currencyModel } from '../models/currencyModel.js';
import { walletModel } from '../models/walletModel.js';
import { methodModel } from '../models/methodModel.js';
import { linkedModel } from '../models/linkedModel.js';
import { withdrawModel } from '../models/withdrawModel.js';
import { kycModel } from '../models/kycModel.js';
import { requestModel } from '../models/requestModel.js';
import { payModel } from '../models/payModel.js';
import { pageModel } from '../models/pageModel.js';

dotenv.config();

const config = {
  HOST: process.env.MYSQL_HOST_IP,
  DB: process.env.MYSQL_DATABASE,
  USER: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASSWORD,
  dialect: process.env.DIALECT || 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;

db.users = userModel(sequelize);
db.merchants = merchantModel(sequelize);
db.settings = settingsModel(sequelize);
db.logs = logsModel(sequelize);
db.withdraws = withdrawModel(sequelize);
db.transfers = transferModel(sequelize);
db.deposits = depositModel(sequelize);
db.exchanges = exchangeModel(sequelize);
db.currencies = currencyModel(sequelize);
db.wallets = walletModel(sequelize);
db.gateways = gatewayModel(sequelize);
db.kycs = kycModel(sequelize);
db.methods = methodModel(sequelize);
db.linkeds = linkedModel(sequelize);
db.requests = requestModel(sequelize);
db.pays = payModel(sequelize);
db.pages = pageModel(sequelize);

// Merchant Relation
db.users.hasOne(db.merchants, { as: 'merchant', foreignKey: 'userId' });
db.merchants.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});
// Deposit Relation
db.users.hasMany(db.deposits, { as: 'deposits' });
db.deposits.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});
// Withdraw Relation
db.users.hasMany(db.withdraws, { as: 'withdraws' });
db.withdraws.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});
// Transfer Relation
db.users.hasMany(db.transfers, { as: 'transfers' });
db.transfers.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});
// Exchange Relations
db.users.hasMany(db.exchanges, { as: 'exchanges' });
db.exchanges.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});
// Wallet Relation
db.users.hasMany(db.wallets, { as: 'wallets' });
db.wallets.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});
// KYC Relation
db.users.hasMany(db.kycs, { as: 'kycs' });
db.kycs.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});
// Linked Account Relation
db.users.hasMany(db.linkeds, { as: 'linkeds' });
db.linkeds.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});
db.linkeds.belongsTo(db.methods, {
  foreignKey: 'methodId',
  as: 'method',
});
// Request Relation
db.merchants.hasMany(db.requests, { as: 'requests' });
db.requests.belongsTo(db.merchants, {
  foreignKey: 'merchantId',
  as: 'merchant',
});
// Pays Relation
db.users.hasMany(db.pays, { as: 'pays' });
db.pays.belongsTo(db.users, {
  foreignKey: 'userId',
  as: 'user',
});

db.sequelize = sequelize;

export default db;

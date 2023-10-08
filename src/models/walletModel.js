import { DataTypes } from 'sequelize';

export const walletModel = (sequelize) => {
  const Wallet = sequelize.define('wallet', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    balance: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING,
    },
  });
  return Wallet;
};



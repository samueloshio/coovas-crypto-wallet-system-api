import { DataTypes } from 'sequelize';

export const payModel = (sequelize) => {
  const Pay = sequelize.define('pay', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'success',
    },
    trxId: {
      type: DataTypes.STRING,
    },
    merchant: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
  });
  return Pay;
};

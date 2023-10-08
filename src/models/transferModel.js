import { DataTypes } from 'sequelize';

export const transferModel = (sequelize) => {
  const Transfer = sequelize.define('transfer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    trxId: {
      type: DataTypes.STRING,
    },
  });
  return Transfer;
};

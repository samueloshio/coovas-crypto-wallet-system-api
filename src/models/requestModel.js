import { DataTypes } from 'sequelize';

export const requestModel = (sequelize) => {
  const Request = sequelize.define('request', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    trxId: {
      type: DataTypes.STRING,
    },
    customer: {
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
  return Request;
};

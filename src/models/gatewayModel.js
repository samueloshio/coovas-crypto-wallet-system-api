import { DataTypes } from 'sequelize';

export const gatewayModel = (sequelize) => {
  const Gateway = sequelize.define('gateway', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING,
    },
    apiKey: {
      type: DataTypes.STRING,
    },
    secretKey: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    isCrypto: {
      type: DataTypes.BOOLEAN,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
    isExchangePayment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ex1: {
      type: DataTypes.STRING,
    },
    ex2: {
      type: DataTypes.STRING,
    },
  });
  return Gateway;
};

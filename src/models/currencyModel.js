import { DataTypes } from 'sequelize';

export const currencyModel = (sequelize) => {
  const Currency = sequelize.define('currency', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    symbol: {
      type: DataTypes.STRING,
    },
    icon: {
      type: DataTypes.STRING,
    },
    rateUsd: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
    },
    ratefromApi: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    crypto: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    metadata: {
      type: DataTypes.TEXT,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return Currency;
};

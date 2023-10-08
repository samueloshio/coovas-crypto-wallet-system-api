import { DataTypes } from 'sequelize';

export const exchangeModel = (sequelize) => {
    const Exchange = sequelize.define('exchange', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      from: {
        type: DataTypes.STRING,
      },
      to: {
        type: DataTypes.STRING,
      },
      exchangeRate: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
      },
      amountFrom: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
      },
      amountTo: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
      },
      fee: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
      },
      total: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
      },
    });
  return Exchange;
};


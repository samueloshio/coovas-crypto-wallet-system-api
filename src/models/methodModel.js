import { DataTypes } from 'sequelize';

export const methodModel = (sequelize) => {
  const Method = sequelize.define('method', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    params: {
      type: DataTypes.TEXT,
      get() {
        return JSON.parse(this.getDataValue('params'));
      },
      set(value) {
        this.setDataValue('params', JSON.stringify(value));
      },
    },
    minAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
    },
    maxAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 20000.0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    fixedCharge: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    percentageCharge: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return Method;
};

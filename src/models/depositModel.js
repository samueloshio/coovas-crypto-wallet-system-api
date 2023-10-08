import { DataTypes } from 'sequelize';

export const depositModel = (sequelize) => {
    const Deposit = sequelize.define('deposit', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      payment_method: {
        type: DataTypes.STRING,
      },
      payment_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
   return Deposit;
};

import { DataTypes } from 'sequelize';

export const merchantModel = (sequelize) => {
  const Merchant = sequelize.define('merchant', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    merId: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    proof: {
      type: DataTypes.STRING,
    },
  });
  return Merchant;
};

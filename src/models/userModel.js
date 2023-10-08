import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export const userModel = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    profile: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('password', bcrypt.hashSync(val, 10));
      },
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    kyc: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refferCode: {
      type: DataTypes.INTEGER,
    },
    refferedBy: {
      type: DataTypes.INTEGER,
    },
    reset: {
      type: DataTypes.INTEGER,
    },
    passUpdate: {
      type: DataTypes.INTEGER,
    },
  });
  return User;
};

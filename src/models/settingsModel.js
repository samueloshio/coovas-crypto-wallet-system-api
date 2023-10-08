import { DataTypes } from 'sequelize';

export const settingsModel = (sequelize) => {
  const Setting = sequelize.define('setting', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
    },
    param1: {
      type: DataTypes.TEXT,
    },
    param2: {
      type: DataTypes.TEXT,
    },
  });
  return Setting;
};

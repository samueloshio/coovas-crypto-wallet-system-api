import { DataTypes } from 'sequelize';

export const logsModel = (sequelize) => {
  const Log = sequelize.define('log', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
    },
  });
  return Log;
};

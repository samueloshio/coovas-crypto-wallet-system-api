import { DataTypes } from 'sequelize';

export const kycModel = (sequelize) => {
  const Kyc = sequelize.define('kyc', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    front: {
      type: DataTypes.STRING,
    },
    back: {
      type: DataTypes.STRING,
    },
    selfie: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  });
  return Kyc;
};

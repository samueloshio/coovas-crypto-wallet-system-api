import { DataTypes } from 'sequelize';

export const linkedModel = (sequelize) => {
  const Linked = sequelize.define('linked', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
  });
  return Linked;
};

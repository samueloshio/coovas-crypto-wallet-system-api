import { DataTypes } from 'sequelize';

export const pageModel = (sequelize) => {
  const Page = sequelize.define('page', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'landing',
    },
    name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      get() {
        return JSON.parse(this.getDataValue('content'));
      },
      set(value) {
        this.setDataValue('content', JSON.stringify(value));
      },
    },
  });
  return Page;
};

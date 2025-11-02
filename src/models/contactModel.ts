import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../config/dbMysql'; // Import our sequelize connection

// 1. Define the Interface for the model's attributes
// We can use InferAttributes and InferCreationAttributes for safety
interface IContact extends Model<InferAttributes<IContact>, InferCreationAttributes<IContact>> {
  id: CreationOptional<number>;
  name: string;
  email: string;
  message: string;
}

// 2. Initialize the Model
// We're defining the 'Contact' model, which will map to a 'contacts' table
const Contact = sequelize.define<IContact>(
  'Contact',
  {
    // Define attributes (columns)
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255), // VARCHAR(255)
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true, // Add built-in validation
      },
    },
    message: {
      type: DataTypes.TEXT, // Use TEXT for longer messages
      allowNull: false,
    },
  },
  {
    // Other model options
    tableName: 'contacts', // Explicitly define the table name
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

export default Contact;
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Make sure env variables are loaded

// 1. Initialize Sequelize
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE as string,
  process.env.MYSQL_USER as string,
  process.env.MYSQL_PASSWORD as string,
  {
    host: process.env.MYSQL_HOST as string,
    dialect: 'mysql', // We are using MySQL
    logging: false, // Set to console.log to see raw SQL queries
  }
);

// 2. Create a function to test the connection
export const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      '[database]: MySQL Connection has been established successfully.'
    );
  } catch (error) {
    console.error('[database]: Unable to connect to MySQL:', error);
    process.exit(1); // Exit process with failure if it can't connect
  }
};

// 3. Export the sequelize instance
export default sequelize;
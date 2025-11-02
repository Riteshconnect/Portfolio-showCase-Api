import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize: Sequelize;

// Check if we are in production (on Render)
if (process.env.DATABASE_URL) {
  // We are in production, use the DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Render Postgres
      },
    },
    logging: false,
  });
} else {
  // We are in development, use local MySQL settings
  sequelize = new Sequelize(
    process.env.MYSQL_DATABASE as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD as string,
    {
      host: process.env.MYSQL_HOST as string,
      dialect: 'mysql',
      logging: false,
    }
  );
}

// Create a function to test the connection
export const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      '[database]: SQL Database Connection has been established successfully.'
    );
  } catch (error) {
    console.error('[database]: Unable to connect to SQL database:', error);
    process.exit(1);
  }
};

// Export the sequelize instance
export default sequelize;
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from 'pg'; // Explicit import so Vercel includes it in the bundle

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false, // turn off SQL logs
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export default sequelize

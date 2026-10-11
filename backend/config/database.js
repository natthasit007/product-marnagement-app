import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// production (Neon/Render): ใช้ DATABASE_URL ตัวเดียว + SSL
// local (docker-compose): ใช้ DB_* เหมือนเดิม
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
          dialect: "postgres",
          logging: false,
          dialectOptions: {
              ssl: { require: true, rejectUnauthorized: false },
          },
      })
    : new Sequelize(
          process.env.DB_NAME,
          process.env.DB_USER,
          process.env.DB_PASSWORD,
          {
              host: process.env.DB_HOST,
              port: process.env.DB_PORT,
              dialect: "postgres",
              logging: false,
          },
      );

const connectDB = async () =>{
    try {
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL");
        await sequelize.sync({
            alter: process.env.NODE_ENV === "development",
        });
        console.log("Table Synchronized!");
    } catch (error) {
        console.error("Connection failed",error);
        process.exit(1);
    }
};
export {sequelize, connectDB};
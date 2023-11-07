import { Sequelize } from 'sequelize-typescript';

const DB_NAME = 'sutd';
const DB_USER = 'root';
const DB_PASS = 'root';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
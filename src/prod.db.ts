import { Sequelize } from 'sequelize-typescript';

const DB_NAME = 'isit';
const DB_USER = 'tofu_usr';
const DB_PASS = '01ma23kcDZKWALwf';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
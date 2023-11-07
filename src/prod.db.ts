import { Sequelize } from 'sequelize-typescript';

const DB_NAME = 'isit';
const DB_USER = 'isit_usr';
const DB_PASS = '01ma23kc';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
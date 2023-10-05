import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { errorHandler } from './middleware/error-handling.middleware';
import path from 'path';

const app = express();
const PORT = 9900

app.use(
  cors({
    origin: [
      'http://localhost:3001',
      '*'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  }),
);
app.use(express.json());
app.use('/static', express.static(path.join(__dirname , '/static')));
app.use('/api', router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
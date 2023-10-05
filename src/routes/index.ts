import { Router } from 'express';
import { clientRouter } from './client.router';

const router = Router();

router.use('/clients', clientRouter);

export { router };

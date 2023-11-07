import { Router } from 'express';
import { abonementRouter } from './abonement.router';
import { clientRouter } from './client.router';
import { mentorRouter } from './mentor.router';
import { orderRouter } from './order.router';

const router = Router();

router.use('/clients', clientRouter);
router.use('/orders', orderRouter);
router.use('/mentors', mentorRouter);
router.use('/abonements', abonementRouter);

export { router };

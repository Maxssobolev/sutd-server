import { Router } from 'express';
import abonementController from '../controllers/abonement.controller';

const abonementRouter = Router();

abonementRouter.get('', abonementController.getAll)
abonementRouter.get('/:id', abonementController.getOne)

export { abonementRouter };

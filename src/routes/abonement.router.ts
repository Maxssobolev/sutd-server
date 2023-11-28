import { Router } from 'express';
import abonementController from '../controllers/abonement.controller';

const abonementRouter = Router();

abonementRouter.get('/stats', abonementController.amountCostsStat)
abonementRouter.get('/commonstats', abonementController.commonStats)
abonementRouter.get('', abonementController.getAll)
abonementRouter.get('/:id', abonementController.getOne)
abonementRouter.put('/:id', abonementController.update)
abonementRouter.delete('/:id', abonementController.delete)
abonementRouter.post('', abonementController.create)

export { abonementRouter };

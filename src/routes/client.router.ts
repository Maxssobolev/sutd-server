import { Router } from 'express';
import clientController from '../controllers/client.controller';

const clientRouter = Router();

clientRouter.get('', clientController.getAllUsers)
clientRouter.get('/:id', clientController.getOneUser)

export { clientRouter };

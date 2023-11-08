import { Router } from 'express';
import clientController from '../controllers/client.controller';

const clientRouter = Router();

clientRouter.get('', clientController.getAllUsers)
clientRouter.get('/:id', clientController.getOneUser)
clientRouter.put('/:id', clientController.update)

export { clientRouter };

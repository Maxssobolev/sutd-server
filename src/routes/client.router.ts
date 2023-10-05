import { Router } from 'express';
import clientController from '../controllers/client.controller';

const clientRouter = Router();

clientRouter.get('', clientController.getAllUsers)

export { clientRouter };

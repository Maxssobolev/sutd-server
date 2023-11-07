import { Router } from 'express';
import clientController from '../controllers/order.controller';

const orderRouter = Router();

orderRouter.get('', clientController.getAllOrders)

export { orderRouter };

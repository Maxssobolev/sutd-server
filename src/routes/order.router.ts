import { Router } from 'express';
import orderController from '../controllers/order.controller';

const orderRouter = Router();

orderRouter.get('', orderController.getAllOrders)
orderRouter.get('/:id', orderController.getOne)
orderRouter.put('/:id', orderController.update)
orderRouter.post('', orderController.create)
export { orderRouter };

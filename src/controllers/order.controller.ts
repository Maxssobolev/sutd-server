import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../shared/error/ApiError';
import { OrderService } from '../services/order.service';

class OrderController {
  private orderService: OrderService = new OrderService();

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    return await this.orderService
      .getAllOrders(Number(req.query.page), Number(req.query.limit), req.query.search as string)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  
}

export default new OrderController();

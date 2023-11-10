import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../shared/error/ApiError';
import { OrderService } from '../services/order.service';

class OrderController {
  private orderService: OrderService = new OrderService();

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    return await this.orderService
      .getAllOrders(Number(req.query.page), Number(req.query.limit), req.query.search as string, req.query.sortmodel)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    return await this.orderService
      .getOne(Number(req.params.id))
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return await this.orderService
      .update(req.body)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return await this.orderService
      .create(req.body)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  
}

export default new OrderController();

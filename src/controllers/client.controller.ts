import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../shared/error/ApiError';
import { ClientService } from '../services/client.service';

class ClientController {
  private clientService: ClientService = new ClientService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    return await this.clientService
      .getAllUsers(Number(req.query.page), Number(req.query.limit), req.query.search as string, req.query.sortmodel )
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };
  
  getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    return await this.clientService
      .getOne(Number(req.params.id))
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return await this.clientService
      .update(req.body)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return await this.clientService
      .create(req.body)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  
}

export default new ClientController();

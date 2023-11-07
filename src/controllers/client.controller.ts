import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../shared/error/ApiError';
import { ClientService } from '../services/client.service';

class ClientController {
  private clientService: ClientService = new ClientService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    return await this.clientService
      .getAllUsers(Number(req.query.page), Number(req.query.limit), req.query.search as string)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };
  
  getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    return await this.clientService
      .getOne(Number(req.params.id))
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  
}

export default new ClientController();

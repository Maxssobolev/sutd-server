import { NextFunction, Request, Response } from 'express';
import { ClientService } from '../services/client.service';
import { ApiError } from '../shared/error/ApiError';

class ClientController {
  private pluginService: ClientService = new ClientService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    return await this.pluginService
      .getAllUsers()
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  
}

export default new ClientController();

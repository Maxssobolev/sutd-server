import { NextFunction, Request, Response } from 'express';

import { AbonementService } from '../services/abonement.service';
import { ApiError } from '../shared/error/ApiError';

class AbonementController {
  private mentorService: AbonementService = new AbonementService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    return await this.mentorService
      .getAll(Number(req.query.page), Number(req.query.limit), req.query.search as string)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };
  
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    return await this.mentorService
      .getOne(Number(req.params.id))
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  
}

export default new AbonementController();

import { NextFunction, Request, Response } from 'express';

import { AbonementService } from '../services/abonement.service';
import { ApiError } from '../shared/error/ApiError';

class AbonementController {
  private abonementService: AbonementService = new AbonementService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    return await this.abonementService
      .getAll(Number(req.query.page), Number(req.query.limit), req.query.search as string, req.query.sortmodel)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };
  
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    return await this.abonementService
      .getOne(Number(req.params.id))
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  amountCostsStat = async (req: Request, res: Response, next: NextFunction) => {
    return await this.abonementService
      .amountCostsStat()
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  commonStats = async (req: Request, res: Response, next: NextFunction) => {
    return await this.abonementService
      .commonStat()
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return await this.abonementService
      .update(req.body)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return await this.abonementService
      .create(req.body)
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return await this.abonementService
      .delete(Number(req.params.id))
      .then(resp => res.json(resp))
      .catch(err => next(ApiError.badRequest(err)));
  };

  
}

export default new AbonementController();

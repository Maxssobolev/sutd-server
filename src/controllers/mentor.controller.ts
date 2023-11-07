import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../shared/error/ApiError';
import { MentorService } from '../services/mentor.service';

class MentorController {
  private mentorService: MentorService = new MentorService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    return await this.mentorService
      .getAllMentors(Number(req.query.page), Number(req.query.limit), req.query.search as string)
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

export default new MentorController();

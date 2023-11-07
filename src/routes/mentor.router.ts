import { Router } from 'express';
import mentorController from '../controllers/mentor.controller';

const mentorRouter = Router();

mentorRouter.get('', mentorController.getAll)
mentorRouter.get('/:id', mentorController.getOne)

export { mentorRouter };

import { Router } from 'express';
import {
  getAllSubjects,
  createSubject,
  getSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController';

const router = Router();

router
  .route('/')
  .get(getAllSubjects)
  .post(createSubject);

router
  .route('/:id')
  .get(getSubject)
  .put(updateSubject)
  .delete(deleteSubject);

export default router; 
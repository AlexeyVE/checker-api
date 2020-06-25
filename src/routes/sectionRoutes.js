import { Router } from 'express';
import {
  getAllSections,
  createSection,
  getSection,
  updateSection,
  deleteSection
} from '../controllers/SectionController';

const router = Router();

router
  .route('/')
  .get(getAllSections)
  .post(createSection);

router
  .route('/:id')
  .get(getSection)
  .put(updateSection)
  .delete(deleteSection);

export default router; 
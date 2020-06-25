import { Router } from 'express';
import {
  getAllDepartments,
  createDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';
import { protect, restrictTo } from '../controllers/authController'

const router = Router();
router.use(protect);
router
  .route('/')
  .get(getAllDepartments)
  .post(createDepartment);

router
  .route('/:id')
  .get(getDepartment)
  .put(updateDepartment)
  .delete(
    restrictTo('admin'),
    deleteDepartment
  );

export default router;
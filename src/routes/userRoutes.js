import { Router } from 'express';
import {
  getMe,
  getUser,
  updateMe,
  deleteMe,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers
} from '../controllers/userController';
import { 
  signup,
  login,
  logout, 
  protect, 
  resetPassword,
  forgotPassword,
  updatePassword
} from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.get('/me', getMe, getUser);

router.patch('/updateMyPassword', updatePassword);

router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);


router
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser);

export default router; 

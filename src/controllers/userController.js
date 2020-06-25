import User from '../models/userModel';
import { __catchAsync, __AppError, __filteredObj } from '../utils';

const factory = require('./handlerFactory');

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next()
};

export const getAllUsers = factory.getAll(User)
export const getUser = factory.getOne(User)

// export const getAllUsers = __catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   // res.status(500).json({
//   //   action:"Get all users",
//   //   statusCode: 1,
//   //   message: "Цей маршрут ще не визначений"
//   // });
//   res.status(200).json({
//     action: "Get all users",
//     statusCode: 0,
//     results: users.length,
//     users
//   })
// });

export const updateMe = __catchAsync(async (req, res, next) => {
  // 1) Create error if user POST's password data
  if (req.body.password || req.body.passwordConfirm) {
    next(new __AppError('Помилка!', 400))
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = __filteredObj(req.body, 'name', 'email');
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody,{
    new: true,
    runValidators: true
  })
  res.status(200).json({
    action: "Update user data",
    statusCode: 0,
    updatedUser
  })
});


export const deleteMe = __catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active:false});
  res.status(204).json({
    action:"Delete user"
  })
});



// export const getUser = async(req, res) => {
//   res.status(500).json({
//     action:"Get user",
//     statusCode: 1,
//     message: "Цей маршрут ще не визначений, використовуйте замість цього /signup"
//   })
// };

export const createUser = async (req, res) => {
  res.status(500).json({
    action:"Create user",
    statusCode: 1,
    message: "Цей маршрут ще не визначений"
  });
};

export const updateUser = async (req, res) => {
  res.status(500).json({
    action:"Update user",
    statusCode: 1,
    message: "Цей маршрут ще не визначений"
  });
};

export const deleteUser = async (req, res) => {
  res.status(500).json({
    action:"Delete user",
    statusCode: 1,
    message: "Цей маршрут ще не визначений"
  });
};
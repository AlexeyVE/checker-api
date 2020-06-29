import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { __catchAsync, __AppError, __sendEmail } from '../utils';

const crypto = require('crypto');

const signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
};

const createSendToken = (user, status, res, action = null) => {

  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(status).json({
    action: action,
    statusCode: 0,
    token,
    user
  });
};

export const signup = __catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      role: req.body.role,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
    createSendToken(newUser, 201, res,'Create new user')
    const token = signToken(newUser._id);
    // let user = await User.findOne(newUser.email);
    // console.log(user)
    // res.status(201).json({
    //   action: "Create new user",
    //   statusCode: 0,
    //   token,
    //   newUser
    // })
});

export const login = __catchAsync(async (req, res, next) => {
  const {email, password} = req.body;
  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new __AppError('Введіть електронну пошту та пароль!', 400));
  }
  // 2) Check if user exists and password is correct
  const user = await User.findOne({email}).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next((new __AppError('Неправильна електронна адреса чи пароль!', 401)))
  }
  // 3) If everything ok, send token to client
  createSendToken(user, 200, res, 'Login');
  // const token = signToken(user._id);
  // res.status(200).json({
  //   action: "Login",
  //   statusCode: 0,
  //   token
  // })
});

export const protect = __catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token 
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new __AppError(
      'Ви не авторизовані! Щоб отримати доступ, увійдіть в систему!'
    ), 401);
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    next(
      new __AppError(
        `Користувача, якому належав цей токен, більше не існує!`,
        400
      )
    );
  } 
  // 4) Check if user changed password after the token was issued
  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new __AppError(
        'Користувач нещодавно змінив пароль! Будь ласка, увійдіть ще раз!', 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
});

//Only for rendered pages, no errors!
export const isLoggedIn = async (req, res, next) => {  
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );  
      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      } 
      // 3) Check if user changed password after the token was issued
      if (await currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // THERE IS A LOOGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next()
    }   
  }
  next();    
};

export const logout = (req, res) => {
  res.cookie('jwt', 'Logout cookie', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    action: 'Logout',
    statusCode: 0
  })
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles['admin', 'user', 'guest'].role='guest'
    if (!roles.includes(req.user.role)) {
      return next(new __AppError('Ви не маєте дозволу на здійснення цієї дії!', 403))
    }
    next();
  };
};

export const forgotPassword = __catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    return next(new __AppError('Немає користувача з такою електронною адресою!', 404));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});

  // 3) Send it to user's email
  const resetURL = 
    `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Забули свій пароль? Надішліть запит PATCH разом із новим паролем та підтвердьте пароль:${resetURL}.\nЯкщо ви не забули свій пароль, проігноруйте цей лист!`;
  try {
    await __sendEmail({
      email: user.email,
      subject: `Ваш токен скидання пароля(дійсний 10хв).`,
      message
    });
    res.status(200).json({
      statusCode: 0,
      message: 'Токен відправлено на Вашу пошту!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});
    return next(
      new __AppError(
      'Під час надсилання листа сталася помилка! Повторіть спробу пізніше!', 
      500)
    );
  }
});

export const resetPassword = __catchAsync( async (req, res, next) =>  {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()}
  });  
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new __AppError('Токен недійсний або закінчився!', 400))
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); 
  // 3) Update ChangedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res, 'Login');
  // const token = signToken(user._id);
  // res.status(200).json({
  //   action: "Login",
  //   statusCode: 0,
  //   token
  // });
});

export const updatePassword = __catchAsync( async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new __AppError('Ваш поточний пароль неправильний!', 401))
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log user in, sent JWT
  createSendToken(user, 200, res,'Update password');
});
import __AppError from '../utils/appError';

const handleCastErrorDb = err => {
  const message = `Недійсний ${err.path}: ${err.value}`
  return new __AppError(message, 400)
};

const handleDublicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message =
   `Дублювання значення поля:${value}.Будь ласка, використовуйте інше значення`;
  return new __AppError(message, 400)
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Недійсні вхідні дані.${errors.join('. ')}`
  return new __AppError(message, 400)
};

const handleJWTError = () => 
  new __AppError('Неприпустимий токен. Будь ласка, увійдіть ще раз!', 401);

const handleJWTExpiredError = () => 
  new __AppError(`Ваш токен недійсний. Увійдіть знову.`, 401);

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrProd = (err, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
      });
  // programming or other unknown error: dont leak error details   
  } else {
    // 1)log error
    console.log('ERROR', err);
    // 2) send generic message
    res.status(500).json({
      statusCode: 1,
      message: "Щось пішло не так!"
    });
  };
};

const errorController =  (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Помилка';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    if (error.code === 11000) error = handleDublicateFieldsDB(error); 
    if (error.name === 'CastError') error = handleCastErrorDb(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpairedError') error = handleJWTExpiredError();
    sendErrProd(error, res);
  }
};

export default errorController
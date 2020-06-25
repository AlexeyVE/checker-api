import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import emSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { __AppError } from './utils';
import globalErrorHandler from './controllers/errorController';
import departmentRoutes from './routes/departmentRoutes';
import subjectRoutes from './routes/subjectRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Global middlewares

// Set security http headers
app.use(helmet());

// Development loggin
if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
};

// Limit request from same API 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Помилка! Забагато запитів з цього IP, спробуйте через годину!"
});

app.use('/api', limiter);

//Body parser, read data from body into req.body
app.use(express.json({limit: '10kb'}));
// app.use(express.json());
//Data sanitization against NoSQL query injection
app.use(emSanitize());

// Data sanitization against XSS attacks
app.use(xss());

//Prevent parameter pollution
// app.use(hpp({
//   whitelist:[]
// }));
app.use(hpp());

//Servring static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  next();
});

//Rotes
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/users", userRoutes);

// Page not found handler
app.all('*', (req, res, next) => {
  next(new __AppError(`Сторінки ${req.originalUrl} не знайдено!`, 404));
});

app.use(globalErrorHandler);

export default app;
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 3737;
const DB = process.env.DATABASE_URL;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => console.log("DB connection successful"));

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
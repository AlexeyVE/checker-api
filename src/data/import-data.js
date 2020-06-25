const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('../models/__Task');

dotenv.config();

const port = process.env.PORT || 3737;
const DB = process.env.IMPORTED_DATA;

mongoose.connect("mongodb://localhost:27017/impoted", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => console.log("DB connection successful"));

const tasks = JSON.parse(
  fs.readFileSync(`${__dirname}/db.json`,'utf-8')
);

const importData = async () => {
  try {
    await Task.create(tasks);
    console.log('Data loaded!'); 
  } catch(err) {
    console.log(err);
  };
  process.exit();   
};

const deleteData = async () => {
  try {
    await Task.deleteMany();
    console.log('Data deleted!');
  } catch(err) {
    console.log(err);
  };
  process.exit();   
};

if (process.argv[2] === '--import') {
  importData();
}
else if (process.argv[2] === '--delete') {
  deleteData();
};


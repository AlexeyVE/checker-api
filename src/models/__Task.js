const mongoose = require('mongoose');

const __TaskSchema = new mongoose.Schema({
  task_complexity: Number,
  task_type: String,
  task_img: String,
  task_body: String,
  task_answers:[{
    answer_body: String,
    correct: Boolean
  }]
});

module.exports = mongoose.model('__Task',__TaskSchema);
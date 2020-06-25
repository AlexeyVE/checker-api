import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
    text_before_task: String,
    task_type: {
      type: String,
      required: true
    },
    task_complexity:{
      type: Number,
      required:true
    },
    task_body:{
      type: String,
      required: true,
      unique: true
    },
    task_images: [String],
    task_answers: [
        {  
           text: {
               type: String,
               required: true,
           },
           isCorrect: {
               type: Boolean,
               required: true,
               default: false
           }
        }
    ]
  },
 {
  timestamps: true
})

export default mongoose.model('Task', TaskSchema)
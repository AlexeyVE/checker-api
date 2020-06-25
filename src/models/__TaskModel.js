import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
    description: String,
    alternatives: [
        {  
           text: {
               type: String,
               required: true,
               unique: true
           },
           isCorrect: {
               type: Boolean,
               required: true,
               default: false
           }
        }
    ]
})

export default mongoose.model('Task', TaskSchema)
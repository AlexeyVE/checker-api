import mongoose from 'mongoose'

const TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  subject:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  section:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section"
  },
  tasks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
},{
  timestamps: true
})

export default mongoose.model('Topic', TopicSchema)
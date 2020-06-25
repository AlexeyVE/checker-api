import mongoose from 'mongoose';
import Department from './departmentModel';

const SubjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  sections:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }],
  topics:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic"
  }]
},{
  timestamps: true
})

export default mongoose.model('Subject', SubjectSchema)
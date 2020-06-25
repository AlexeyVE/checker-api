import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  topics:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic"
  }]
},{
  timestamps: true
});

export default mongoose.model('Section', SectionSchema);
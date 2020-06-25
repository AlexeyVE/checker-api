const mongoose = require('mongoose');

const DisciplineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  allowUsers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sections:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section' 
  }],
  themes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theme"
  }]
},{
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

module.exports = mongoose.model('Discipline', 'DisciplineSchema');

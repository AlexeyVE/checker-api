import mongoose from 'mongoose';
import User from './userModel';

const DepartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  users:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  subjects:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  sections:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section' 
  }],
  topics:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic"
  }]
},{
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

// DepartmentSchema.pre('save', async function(next) {
//   const usersPromises = this.users.map(async id => await User.findById(id));
//   this.users = await Promise.all(usersPromises);
//   next();
// });
// DepartmentSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'users',
//     select:'-__v -passwordChangedAt'
//   })
// });

// virtual populate
// DepartmentSchema.virtual('subjects', {
//   ref: 'subject',
//   foreignField:'department',
//   localField: _id
// })
// DepartmentSchema.pre(/^find/, function(next) {
//   this.populate({
//     path:'subjects',
//     select: 'title id'
//   }).populate({
//     path:'sections',
//     select:'title id'
//   })
//   next()
// });



export default mongoose.model('Department', DepartmentSchema);
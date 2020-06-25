import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required :true,
    unique: [true, "Такий email вже існує"],
    lowercase: true,
    validate: [validator.isEmail, "Введіть коректний email"]
  },
  password: {
    type: String,
    required: [true, "Введіть пароль"],
    minlength:[8, "Пароль має містити мінімум 8 символів!"],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // This only works on Create and Save!!!
      validator: function (el) {
        return el === this.password;
      },
      message:"Паролі не співпадають!"
    }
  },
  role: {
    type: String,
    enum: ['guest', 'user', 'admin'],
    default: "guest"
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
},{
  timestamps: true,
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

UserSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if(!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete the password confim field
  this.passwordConfirm = undefined;
  return next();
});

UserSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

// UserSchema.pre(/^find/, async function(next) {
//   // this points to the current query
//   await this.find({active: {$ne: false}});
//   return next();
// });

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = async function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)
    // console.log(this.changedTimeStamp, JWTTimestamp)
    return JWTTimestamp < changedTimeStamp;
  }
  // false means not changed
  return false;
};
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

export default mongoose.model('User', UserSchema);



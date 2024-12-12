const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: '',
    required: true,
  },
  state: {
    type: String,
    default: '',
    required: true,
  },
  totalPointsEarned: {
    type: Number,
    default: 0,
  },
  userDescription: { type: String, default: '' },
  coupons: [],
  profilePicture: {
    type: String,
    default:
      'https://i.pinimg.com/564x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg',
  },
});

// // Encrypt password before saving
// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next()
//   }
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   next()
// })

// // Match user password
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password)
// }

module.exports = mongoose.model('User', UserSchema);

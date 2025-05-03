
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user', // Default role is 'user'
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

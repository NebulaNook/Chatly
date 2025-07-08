import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
}, { timestamps: true });

export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For one-to-one
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null }, // For group chat
  encryptedText: String,  // Store encrypted message
  type: { type: String, default: "text" },
}, { timestamps: true });


export default mongoose.model('Message', messageSchema);

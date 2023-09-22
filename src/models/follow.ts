import mongoose from 'mongoose';

interface IFollow {
  followerId: mongoose.Types.ObjectId;
  followingId: mongoose.Types.ObjectId;
}

const followSchema = new mongoose.Schema({
  followerId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  followingId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});

const Follow = mongoose.model('Follow', followSchema);
export { Follow };

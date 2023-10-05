import mongoose from 'mongoose';
import { Follow } from './follow';
import { Tweet } from './tweet'; // Adjust the import path as per your project structure
interface IUserDoc extends mongoose.Document, IUser {}

interface IUser {
  username: string;
  email: string;
  password: string;
  bio?: string;
  profilePicture?: string;
}

interface UserModelInterface extends mongoose.Model<IUserDoc> {
  build(attr: IUser): IUserDoc;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  profilePicture: String
}, { timestamps: true });

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

userSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const doc: IUserDoc = this;
  
  // Delete all the follows and followers of the user
  await Follow.deleteMany({ $or: [{ followerId: doc._id }, { followingId: doc._id }] });
  
  // Delete all the tweets from the user
  await Tweet.deleteMany({ userId: doc._id });
});

const User = mongoose.model<IUserDoc, UserModelInterface>('User', userSchema);
export { User };

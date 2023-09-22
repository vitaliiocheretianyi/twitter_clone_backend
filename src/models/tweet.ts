import mongoose from 'mongoose';

interface ITweet {
  userId: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  imageURL?: string;
  originalTweet?: mongoose.Types.ObjectId; // Reference to the original tweet if this is a retweet
}

const tweetSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 280 },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  retweets: { type: Number, default: 0 },
  imageURL: String,
  originalTweet: { type: mongoose.Types.ObjectId, ref: 'Tweet' } // Using the ref 'Tweet' since it's referencing its own model
});

const Tweet = mongoose.model('Tweet', tweetSchema);
export { Tweet };

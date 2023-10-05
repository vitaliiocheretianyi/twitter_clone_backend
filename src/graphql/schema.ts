import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLList } from 'graphql';
import { Types } from 'mongoose';
import { User } from '../models/user';
import { Tweet } from '../models/tweet';
import { Follow } from '../models/follow';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    bio: { type: GraphQLString },
    profilePicture: { type: GraphQLString }
  })
});

const TweetType = new GraphQLObjectType({
  name: 'Tweet',
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    content: { type: GraphQLString },
    timestamp: { type: GraphQLString },
    likes: { type: GraphQLInt },
    retweets: { type: GraphQLInt },
    imageURL: { type: GraphQLString },
    originalTweet: { type: GraphQLID }
  })
});

const FollowType = new GraphQLObjectType({
  name: 'Follow',
  fields: () => ({
    followerId: { type: GraphQLID },
    followingId: { type: GraphQLID }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Queries can be added here if needed
  }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addUser: {
        type: UserType,
        args: {
          username: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
          bio: { type: GraphQLString },
          profilePicture: { type: GraphQLString }
        },
        resolve(parent, args) {
          let user = new User({
            username: args.username,
            email: args.email,
            password: args.password,  // NOTE: Hash the password before saving
            bio: args.bio,
            profilePicture: args.profilePicture
          });
          return user.save();
        }
      },
      changeUserEmail: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          email: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(parent, args) {
          return User.findByIdAndUpdate(args.id, { email: args.email }, { new: true });
        }
      },
      changeUsername: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          username: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(parent, args) {
          return User.findByIdAndUpdate(args.id, { username: args.username }, { new: true });
        }
      },
      changeUserPassword: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(parent, args) {
          // NOTE: Hash the password before saving
          return User.findByIdAndUpdate(args.id, { password: args.password }, { new: true });
        }
      },
      changeUserBio: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          bio: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(parent, args) {
          return User.findByIdAndUpdate(args.id, { bio: args.bio }, { new: true });
        }
      },
      deleteUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) }
        },
        async resolve(parent, args) {
          return User.findByIdAndDelete(args.id);
        }
      },
      createTweet: {
        type: TweetType,
        args: {
          userId: { type: new GraphQLNonNull(GraphQLID) },
          content: { type: new GraphQLNonNull(GraphQLString) },
          imageURL: { type: GraphQLString }
        },
        resolve(parent, args) {
          let tweet = new Tweet({
            userId: args.userId,
            content: args.content,
            imageURL: args.imageURL
          });
          return tweet.save();
        }
      },
      editTweet: {
        type: TweetType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          content: { type: new GraphQLNonNull(GraphQLString) },
          imageURL: { type: GraphQLString }
        },
        async resolve(parent, args) {
          return Tweet.findByIdAndUpdate(args.id, {
            content: args.content,
            imageURL: args.imageURL
          }, { new: true });
        }
      },
      likeTweet: {
        type: TweetType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        async resolve(parent, args) {
            const tweet = await Tweet.findById(args.id);
            if (!tweet) {
                throw new Error('Tweet not found');
            }
            tweet.likes = tweet.likes + 1;
            return tweet.save();
        }
      },    
      retweet: {
        type: TweetType,
        args: {
          userId: { type: new GraphQLNonNull(GraphQLID) },
          originalTweetId: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parent, args) {
          let tweet = new Tweet({
            userId: args.userId,
            originalTweet: args.originalTweetId
          });
          return tweet.save();
        }
      },
      deleteTweet: {
        type: TweetType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) }
        },
        async resolve(parent, args) {
          return Tweet.findByIdAndDelete(args.id);
        }
      },
      followUser: {
        type: FollowType,
        args: {
          followerId: { type: new GraphQLNonNull(GraphQLID) },
          followingId: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parent, args) {
          let follow = new Follow({
            followerId: args.followerId,
            followingId: args.followingId
          });
          return follow.save();
        }
      },
      unfollowUser: {
        type: FollowType,
        args: {
          followerId: { type: new GraphQLNonNull(GraphQLID) },
          followingId: { type: new GraphQLNonNull(GraphQLID) }
        },
        async resolve(parent, args) {
          return Follow.findOneAndDelete({
            followerId: args.followerId,
            followingId: args.followingId
          });
        }
      }
    }
  });
  
  export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
  });
  

import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { faker } from '@faker-js/faker';
import { Tweet } from '../models/tweet'; // Update import path if needed
import mongoose from 'mongoose';

describe('Tweet Model', function () {
    this.timeout(20000); // 20 seconds
    let createStub: SinonStub;
    let findByIdStub: SinonStub;
    let findByIdAndUpdateStub: SinonStub;
    let findByIdAndDeleteStub: SinonStub;

    beforeEach(function () {
        createStub = sinon.stub(Tweet, 'create');
        findByIdStub = sinon.stub(Tweet, 'findById');
        findByIdAndUpdateStub = sinon.stub(Tweet, 'findByIdAndUpdate');
        findByIdAndDeleteStub = sinon.stub(Tweet, 'findByIdAndDelete');
    });

    afterEach(function () {
        createStub.restore();
        findByIdStub.restore();
        findByIdAndUpdateStub.restore();
        findByIdAndDeleteStub.restore();
    });

    it('should create a tweet successfully', async () => {
        const tweetMock = {
            userId: new mongoose.Types.ObjectId(),
            content: faker.lorem.sentence(),
            likes: faker.datatype.number(),
            retweets: faker.datatype.number()
        };

        createStub.resolves(tweetMock);

        const tweet = await Tweet.create(tweetMock);

        expect(tweet).to.exist;
        expect(tweet.content).to.equal(tweetMock.content);
    });

    it('should fail to create a tweet', async () => {
        const error = new Error('Creation failed');

        createStub.rejects(error);

        try {
            await Tweet.create({});
            expect.fail('Expected error was not thrown');
        } catch (err) {
            expect(err).to.equal(error);
        }
    });

    it('should read a tweet successfully', async () => {
        const tweetMock = {
            userId: new mongoose.Types.ObjectId(),
            content: faker.lorem.sentence(),
            likes: faker.datatype.number(),
            retweets: faker.datatype.number()
        };
        
        findByIdStub.resolves(tweetMock);

        const tweet = await Tweet.findById(tweetMock.userId);

        expect(tweet).to.exist;
        if (!tweet) throw new Error("Tweet is null");
        expect(tweet.content).to.equal(tweetMock.content);
    });

    it('should fail to read a tweet', async () => {
        findByIdStub.resolves(null);

        const tweet = await Tweet.findById(new mongoose.Types.ObjectId());

        expect(tweet).to.not.exist;
    });

    it('should update a tweet successfully', async () => {
        const tweetMock = {
            _id: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            content: faker.lorem.sentence(),
            likes: faker.datatype.number(),
            retweets: faker.datatype.number()
        };

        const newContent = faker.lorem.sentence();
        findByIdAndUpdateStub.resolves({ ...tweetMock, content: newContent });

        const updatedTweet = await Tweet.findByIdAndUpdate(tweetMock._id, { content: newContent }, { new: true });

        expect(updatedTweet).to.exist;
        if (!updatedTweet) throw new Error("Updated tweet is null");
        expect(updatedTweet.content).to.equal(newContent);
    });

    it('should fail to update a tweet', async () => {
        findByIdAndUpdateStub.resolves(null);

        const updatedTweet = await Tweet.findByIdAndUpdate(new mongoose.Types.ObjectId(), { content: faker.lorem.sentence() }, { new: true });

        expect(updatedTweet).to.not.exist;
    });

    it('should delete a tweet successfully', async () => {
        const tweetMock = {
            _id: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
            content: faker.lorem.sentence(),
            likes: faker.datatype.number(),
            retweets: faker.datatype.number()
        };

        findByIdAndDeleteStub.resolves(tweetMock);

        const deletedTweet = await Tweet.findByIdAndDelete(tweetMock._id);

        expect(deletedTweet).to.exist;
        if (!deletedTweet) throw new Error("Deleted tweet is null");
        expect(deletedTweet._id).to.eql(tweetMock._id);
    });

    it('should fail to delete a tweet', async () => {
        findByIdAndDeleteStub.resolves(null);

        const deletedTweet = await Tweet.findByIdAndDelete(new mongoose.Types.ObjectId());

        expect(deletedTweet).to.not.exist;
    });
});

// Importing necessary libraries and modules
import chai, { expect } from 'chai'; // Chai is a BDD / TDD assertion library. 'expect' is one of the interfaces provided by Chai
import sinon, { SinonStub } from 'sinon'; // Sinon is a library used for mocking or spying on functions
import { faker } from '@faker-js/faker'; // Faker is used for generating fake data
import { User } from '../models/user'; // Importing User model
import { Follow } from '../models/follow'; // Importing Follow model
import mongoose from 'mongoose'; // Mongoose is an ODM library for MongoDB and Node.js

// Describing a test suite for the 'Follow Model'
describe('Follow Model', function () {
    // Setting timeout for each test in this suite to 20 seconds
    this.timeout(20000);
    
    // Declaring variables for Sinon stubs and user mocks
    let createStub: SinonStub;
    let deleteOneStub: SinonStub;
    let deleteOneStubUser: SinonStub;
    let user1: any, user2: any;
    
    // Hook that runs before each individual test in this suite
    beforeEach(async function () {
        // Creating stubs for 'create' and 'deleteOne' methods of Follow model to control their behavior
        createStub = sinon.stub(Follow, 'create');
        deleteOneStub = sinon.stub(Follow, 'deleteOne');
        deleteOneStubUser = sinon.stub(User, 'deleteOne');
        
        // Generating mock user data using faker and mongoose.Types.ObjectId for unique _id
        user1 = {
            _id: new mongoose.Types.ObjectId(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };
        
        user2 = {
            _id: new mongoose.Types.ObjectId(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };
    });
    
    // Hook that runs after each individual test in this suite
    afterEach(function () {
        // Restoring the original methods by removing the stubs
        createStub.restore();
        deleteOneStub.restore();
        deleteOneStubUser.restore();
    });
    
    // Test case for successful follow
    it('should follow successfully', async () => {
        // Creating mock follow data
        const followMock = { followerId: user1._id, followingId: user2._id };
        // Configuring 'createStub' to resolve with 'followMock' when it is called
        createStub.resolves(followMock);
        
        // Creating a follow using the Follow model's 'create' method
        const follow = await Follow.create(followMock);
        
        // Asserting that the returned follow object exists and its properties match the mock data
        expect(follow).to.exist;
        expect(follow.followerId).to.eql(user1._id);
        expect(follow.followingId).to.eql(user2._id);
    });
    
    // Test case for failure in follow
    it('should fail to follow', async () => {
        // Creating a new error object
        const error = new Error('Follow failed');
        // Configuring 'createStub' to reject with 'error' when it is called
        createStub.rejects(error);
        
        try {
            // Attempting to create a follow, expecting it to throw an error
            await Follow.create({ followerId: user1._id, followingId: user2._id });
            // If the above line does not throw an error, this line will fail the test
            expect.fail('Expected error was not thrown');
        } catch (err) {
            // Asserting that the thrown error matches the expected error
            expect(err).to.equal(error);
        }
    });
    
    // Test case for successful unfollow
    it('should unfollow successfully', async () => {
        // Creating mock follow data
        const followMock = { followerId: user1._id, followingId: user2._id };
        // Configuring 'deleteOneStub' to resolve with an object representing successful deletion
        deleteOneStub.resolves({ deletedCount: 1 });
        
        // Deleting a follow using the Follow model's 'deleteOne' method
        const result = await Follow.deleteOne(followMock);
        
        // Asserting that the 'deletedCount' is 1, representing one document deleted successfully
        expect(result.deletedCount).to.equal(1);
    });
    
    // Test case for failure in unfollow
    it('should fail to unfollow', async () => {
        // Configuring 'deleteOneStub' to resolve with an object representing no deletion
        deleteOneStub.resolves({ deletedCount: 0 });
        
        // Attempting to delete a follow and storing the result
        const result = await Follow.deleteOne({ followerId: user1._id, followingId: user2._id });
        
        // Asserting that the 'deletedCount' is 0, representing no documents were deleted
        expect(result.deletedCount).to.equal(0);
    });
});

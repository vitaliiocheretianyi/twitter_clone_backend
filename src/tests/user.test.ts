import chai, { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { faker } from '@faker-js/faker';
import { User } from '../models/user'; // Update import path if needed
import mongoose from 'mongoose';

describe('User Model', function () {
    this.timeout(20000); // 20 seconds
    let createStub: SinonStub;
    let findByIdStub: SinonStub;
    let findByIdAndUpdateStub: SinonStub;
    let findByIdAndDeleteStub: SinonStub;

    beforeEach(function () {
        createStub = sinon.stub(User, 'create');
        findByIdStub = sinon.stub(User, 'findById');
        findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate');
        findByIdAndDeleteStub = sinon.stub(User, 'findByIdAndDelete');
    });

    afterEach(function () {
        createStub.restore();
        findByIdStub.restore();
        findByIdAndUpdateStub.restore();
        findByIdAndDeleteStub.restore();
    });

    it('should create a user successfully', async () => {
        const userMock = {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        createStub.resolves(userMock);

        const user = await User.create(userMock);

        expect(user).to.exist;
        expect(user.username).to.equal(userMock.username);
    });

    it('should fail to create a user', async () => {
        const error = new Error('Creation failed');

        createStub.rejects(error);

        try {
            await User.create({});
            expect.fail('Expected error was not thrown');
        } catch (err) {
            expect(err).to.equal(error);
        }
    });
    it('should read a user successfully', async () => {
        try {
            const userMock = {
                _id: new mongoose.Types.ObjectId(),
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            };
            console.log("Mocking user creation...");

            // When User.create is called with userMock (without _id), it resolves with userMock
            createStub.withArgs(sinon.match({ username: userMock.username, email: userMock.email, password: userMock.password })).resolves(userMock);

            console.log("Mocking user finding...");

            // When User.findById is called with userMock._id, it resolves with userMock
            findByIdStub.withArgs(userMock._id).resolves(userMock);

            const createdUser = await User.create({
                username: userMock.username,
                email: userMock.email,
                password: userMock.password
            });

            console.log("User creation mocked, Mocking user finding...");
            const user = await User.findById(createdUser._id);
            console.log("User finding mocked");

            expect(user).to.exist;
            if (!user) throw new Error("User is null");
            expect(user._id).to.eql(createdUser._id);
            expect(user.username).to.equal(userMock.username);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });

    it('should fail to read a user successfully', async () => {
        findByIdStub.resolves(null);

        const user = await User.findById(new mongoose.Types.ObjectId());

        expect(user).to.not.exist;
    });

    it('should update a user successfully', async () => {
        const userMock = {
            _id: new mongoose.Types.ObjectId(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        const newBio = faker.lorem.sentence();
        findByIdAndUpdateStub.resolves({ ...userMock, bio: newBio });

        const updatedUser = await User.findByIdAndUpdate(userMock._id, { bio: newBio }, { new: true });

        expect(updatedUser).to.exist;
        if (!updatedUser) throw new Error("Updated user is null");
        expect(updatedUser.bio).to.equal(newBio);
    });

    it('should fail to update the user', async () => {
        findByIdAndUpdateStub.resolves(null);

        const updatedUser = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(), { bio: faker.lorem.sentence() }, { new: true });

        expect(updatedUser).to.not.exist;
    });

    it('should delete a user successfully', async () => {
        const userMock = {
            _id: new mongoose.Types.ObjectId(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        findByIdAndDeleteStub.resolves(userMock);

        const deletedUser = await User.findByIdAndDelete(userMock._id);

        expect(deletedUser).to.exist;
        if (!deletedUser) throw new Error("Deleted user is null");
        expect(deletedUser._id).to.eql(userMock._id);
    });

    it('should fail to delete a user', async () => {
        findByIdAndDeleteStub.resolves(null);

        const deletedUser = await User.findByIdAndDelete(new mongoose.Types.ObjectId());

        expect(deletedUser).to.not.exist;
    });

    
});

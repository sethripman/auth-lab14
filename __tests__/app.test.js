require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can signup a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'a@a.com', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          email: 'a@a.com',
          __v: 0
        });
      });
  });

  it('can login a user', async() => {
    const user = await User.create({ email: 'b@b.com', password: 'swordfish' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'b@b.com', password: 'swordfish' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: 'b@b.com',
          __v: 0
        });
      });
  });

  it('fails when a bad email is used', async() => {
    await User.create({ email: 'c@c.com', password: 'swordfish' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'no@c.com', password: 'swordfish' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email/Password',
          status: 401
        });
      });
  });

  it('fails when a bad password is used', async() => {
    await User.create({ email: 'd@d.com', password: 'hackeysack' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'd@d.com', password: 'isnotarealsport' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid Email/Password',
          status: 401
        });
      });
  });
});

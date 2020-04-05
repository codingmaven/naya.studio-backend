const chai = require('chai');
const supertest = require('supertest-as-promised');
const _ = require('lodash');
const mongoose = require('mongoose');
const app = require('../../app/app');
const expect = chai.expect;
const request = supertest(app);

describe('User Controller', function () {

  describe('post /signup for designer', function () {
    it('Should create a new user with input data', async () => {
      const user = {
        email: 'taowang115@gmail.com',
        password: 'Test1234',
        registerAs: 'designer',
        capacity: 1,
        material: 'Wood',
        location: 'abc'
      };

      const res = await request
        .post('/api/signup')
        .send(user)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(res.body).to.be.an('object');
      expect(res.body.email).to.equal(user.email);
      expect(res.body.registerAs).to.equal(user.registerAs);
      expect(res.body.capacity).to.equal(user.capacity);
      expect(res.body.material).to.equal(user.material);
      expect(res.body.location).to.equal(user.location);
    });

    it('Should return 400 for duplicated user', async () => {
      const user = {
        email: 'taowang115@gmail.com',
        password: 'Test1234',
        registerAs: 'designer',
        capacity: 1,
        material: 'Wood',
        location: 'abc'
      };

      const res = await request
        .post('/api/signup')
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/);
    });

    it('Should return 400 for invalid input', async () => {
      const user = {
        email: 'taowang115+new@gmail.com',
        password: 'Test1234',
        registerAs: 'designer',
        capacity: 1,
        material: 'Wood123',
        location: 'abc'
      };

      const res = await request
        .post('/api/signup')
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/);
    });

  });

  describe('post /signup for maker', function () {
    it('Should create a new user with input data', async () => {
      const user = {
        email: 'taowang115+maker@gmail.com',
        password: 'Test1234',
        registerAs: 'maker',
        capacity: 1,
        material: 'Architect',
        location: 'abc'
      };

      const res = await request
        .post('/api/signup')
        .send(user)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(res.body).to.be.an('object');
      expect(res.body.email).to.equal(user.email);
      expect(res.body.registerAs).to.equal(user.registerAs);
      expect(res.body.capacity).to.equal(user.capacity);
      expect(res.body.material).to.equal(user.material);
      expect(res.body.location).to.equal(user.location);
    });

    it('Should return 400 for duplicated user', async () => {
      const user = {
        email: 'taowang115+maker@gmail.com',
        password: 'Test1234',
        registerAs: 'maker',
        capacity: 1,
        material: 'Architect',
        location: 'abc'
      };

      const res = await request
        .post('/api/signup')
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/);
    });

    it('Should return 400 for invalid input', async () => {
      const user = {
        email: 'taowang115+new@gmail.com',
        password: 'Test1234',
        registerAs: 'maker',
        capacity: 1,
        material: 'Architect123',
        location: 'abc'
      };

      const res = await request
        .post('/api/signup')
        .send(user)
        .expect(400)
        .expect('Content-Type', /json/);
    });

  });
});

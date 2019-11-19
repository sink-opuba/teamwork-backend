const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/index');

describe('POST /create-user', () => {
  before(done => {
    db.query(`DELETE FROM users where email = $1`, ['test@email.com'])
      .then(() => done())
      .catch(err => done(err));
  });

  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMzA4Zjg3ZS1mODRkLTQ0NzktODBjZS1lNjhiNmI3NzFlZjMiLCJlbWFpbCI6InRyQHRlc3QuY29tIiwiaWF0IjoxNTc0MTY5Mzg5LCJleHAiOjE1NzQyNTU3ODl9.aIqqZ0LNNU-bXizflSus8TJoF9dns80CbA8lduaRo9k';

  it('should create a new user', done => {
    request(app)
      .post('/api/v1/auth/create-user')
      .set('Authorization', token)
      .send({
        firstName: 'test',
        lastName: 'testLast',
        email: 'test@email.com',
        password: 'test1235',
        gender: 'male',
        jobRole: 'Developer',
        department: 'Engineering',
        address: 'Warri/Lagos'
      })
      .then(res => {
        const { body } = res;
        expect(res.status).to.equal(201);
        expect(body.status).to.contain('success');
        expect(body).to.contain.property('data');
        done();
      })
      .catch(err => done(err));
  });

  it('Should not allow duplicate email', done => {
    request(app)
      .post('/api/v1/auth/create-user')
      .set('Authorization', token)
      .send({
        firstName: 'test',
        lastName: 'testLast',
        email: 'test@email.com',
        password: 'test1235',
        gender: 'male',
        jobRole: 'Developer',
        department: 'Engineering',
        address: 'Warri/Lagos'
      })
      .then(res => {
        const { body } = res;
        expect(res.status).to.equal(400);
        expect(body.status).to.contain('error');
        expect(body.error).to.contain('Email already in use');
        done();
      })
      .catch(err => done(err));
  });

  it('should require authentication token to create user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/create-user')
      .send({
        firstName: 'sink',
        lastName: 'opuba',
        email: 'test@email.com',
        password: 'test1235'
      });

    const { body } = res;
    expect(res.status).to.equal(401);
    expect(body.status).to.contain('error');
    expect(body.error).to.contain(
      'You need an authentication token to access this resource.'
    );
  });
});

describe('POST /signin', () => {
  it('user should be able to sign in with email and password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@email.com',
        password: 'test1235'
      });

    const { body } = res;
    expect(res.status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('userId');
    expect(body.data).to.contain.property('token');
  });

  it('should return invalid request body when user tries to signin without email or password ', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: '',
        password: ''
      });

    const { body } = res;
    expect(res.status).to.equal(400);
    expect(body.status).to.contain('error');
    expect(body.error).to.equal('Invalid request body');
  });

  it('should return Invalid password when user enters incorrect password ', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@email.com',
        password: 'test'
      });

    const { body } = res;
    expect(res.status).to.equal(401);
    expect(body.status).to.contain('error');
    expect(body.error).to.equal('Invalid password');
  });
});

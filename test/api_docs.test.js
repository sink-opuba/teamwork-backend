const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

describe('/GET API docs', () => {
  it('should get api from / endpoint', async () => {
    const res = await request(app)
      .get('/')
      .send();
    expect(res.status).to.equal(200);
    expect(res.type).to.equals('text/html');
  });

  it('should get api from /docs endpoint', async () => {
    const res = await request(app)
      .get('/docs')
      .send();
    expect(res.status).to.equal(200);
    expect(res.type).to.equals('text/html');
  });

  it('should get api from /api/v1/docs endpoint', async () => {
    const res = await request(app)
      .get('/api/v1/docs')
      .send();
    expect(res.status).to.equal(200);
    expect(res.type).to.equals('text/html');
  });
});

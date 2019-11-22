const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const { token } = require('../auth_token');

describe('GET /feed', () => {
  it('should get all available articles from the database', async () => {
    const res = await request(app)
      .get('/api/v1/feed/articles')
      .set('Authorization', token)
      .send();
    const { body, status } = res;
    expect(status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data).to.be.an('array');
  });

  it('should get all available gifs from the database', async () => {
    const res = await request(app)
      .get('/api/v1/feed/gifs')
      .set('Authorization', token)
      .send();
    const { body, status } = res;
    expect(status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data).to.be.an('array');
  });
});

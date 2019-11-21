const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');

const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMzA4Zjg3ZS1mODRkLTQ0NzktODBjZS1lNjhiNmI3NzFlZjMiLCJlbWFpbCI6InRyQHRlc3QuY29tIiwiaWF0IjoxNTc0MjgyMjM0LCJleHAiOjE1NzQzNjg2MzR9.kG1EPCp9zqs15IeASQY2l6oLbLtgHGKerjIXkyHej5s';

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

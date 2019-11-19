const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('POST /gifs', function() {
  this.timeout(8000);
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMzA4Zjg3ZS1mODRkLTQ0NzktODBjZS1lNjhiNmI3NzFlZjMiLCJlbWFpbCI6InRyQHRlc3QuY29tIiwiaWF0IjoxNTc0MTY5Mzg5LCJleHAiOjE1NzQyNTU3ODl9.aIqqZ0LNNU-bXizflSus8TJoF9dns80CbA8lduaRo9k';

  it('should create a new gif', async () => {
    const res = await request(app)
      .post('/api/v1/gifs')
      .set('Authorization', token)
      .field('title', 'a new gif')
      .attach('image', 'C:/Users/User/Pictures/giphyALC4.0.gif');

    const { body } = res;
    expect(res.status).to.equal(201);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('imageUrl');
    expect(body.data.message).to.contain('Gif image successfully posted');
  });
});

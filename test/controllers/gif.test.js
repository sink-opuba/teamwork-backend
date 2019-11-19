const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/index');

xdescribe('POST /gifs', function() {
  before(async () => {
    await db.query(`DELETE FROM gifs where title = $1`, ['a new gif test']);
  });
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMzA4Zjg3ZS1mODRkLTQ0NzktODBjZS1lNjhiNmI3NzFlZjMiLCJlbWFpbCI6InRyQHRlc3QuY29tIiwiaWF0IjoxNTc0MTczMjI5LCJleHAiOjE1NzQyNTk2Mjl9.26LS00-L_xm8JgKVndEkU6cNhrn_X_TT9cNXOd90_Rk';

  xit('should create a new gif', async function() {
    this.timeout(10000);

    const res = await request(app)
      .post('/api/v1/gifs')
      .set('Authorization', token)
      .field('title', 'a new gif test')
      .attach('image', 'C:/Users/User/Pictures/giphyALC4.0.gif');

    const { body } = res;
    expect(res.status).to.equal(201);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('imageUrl');
    expect(body.data.message).to.contain('Gif image successfully posted');
  });
});

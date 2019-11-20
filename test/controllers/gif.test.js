const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/index');

const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMzA4Zjg3ZS1mODRkLTQ0NzktODBjZS1lNjhiNmI3NzFlZjMiLCJlbWFpbCI6InRyQHRlc3QuY29tIiwiaWF0IjoxNTc0MjgyMjM0LCJleHAiOjE1NzQzNjg2MzR9.kG1EPCp9zqs15IeASQY2l6oLbLtgHGKerjIXkyHej5s';

describe('POST /gifs', function() {
  before(async () => {
    await db.query(`DELETE FROM gifs where title = $1`, ['a new gif test']);
  });

  it('should create a new gif', async function() {
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

describe('DELETE /gifs/:gifId', () => {
  let gifid;
  before(async () => {
    const response = await db.query(`SELECT * FROM gifs where title = $1`, [
      'a new gif test'
    ]);
    gifid = response.rows[0].gifid;
  });

  it('should delete the gif from the database', async () => {
    const res = await request(app)
      .delete(`/api/v1/gifs/${gifid}`)
      .set('Authorization', token)
      .send();

    const { body } = res;
    expect(res.status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data.message).to.contain('gif post successfully deleted');
  });
});

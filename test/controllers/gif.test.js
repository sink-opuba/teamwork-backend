const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/index');
const { token, differentToken } = require('../auth_token');

describe('POST /gifs', function() {
  before(async () => {
    await db.query(`DELETE FROM gifs where title = $1`, ['a new gif test']);
  });

  it('should create a new gif', async function() {
    this.timeout(12000);

    const res = await request(app)
      .post('/api/v1/gifs')
      .set('Authorization', token)
      .field('title', 'a new gif test')
      .attach('image', 'images/giphyALC4.0.gif');

    const { body } = res;
    expect(res.status).to.equal(201);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('imageUrl');
    expect(body.data.message).to.contain('Gif image successfully posted');
  });
});

describe('GET /gifs/:gifId', () => {
  let gifid;
  before(async () => {
    const response = await db.query(`SELECT * FROM gifs where title = $1`, [
      'a new gif test'
    ]);
    gifid = response.rows[0].gifid;
  });

  it('should get specific gif with details and associated comments', async () => {
    const res = await request(app)
      .get(`/api/v1/gifs/${gifid}`)
      .set('Authorization', token)
      .send();
    const { body, status } = res;
    expect(status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('comments');
    expect(body.data.comments).to.be.an('array');
  });

  it('should return an error when user attempts to get details and associated comments of non-exitent gif', async () => {
    const res = await request(app)
      .get(`/api/v1/gifs/0`)
      .set('Authorization', token)
      .send();
    const { body, status } = res;
    expect(status).to.equal(404);
    expect(body.status).to.contain('error');
    expect(body.error).to.contain('Gif not found');
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

  it("should return 401 error if user attempts to delete another user's gif post", async () => {
    const res = await request(app)
      .delete(`/api/v1/gifs/${gifid}`)
      .set('Authorization', differentToken)
      .send();
    const { body, status } = res;
    expect(status).to.equal(401);
    expect(body.status).to.contain('error');
    expect(body.error).to.contain(
      "You're not authorised to delete this resource."
    );
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

describe('POST /:gifid/comment', () => {
  before(async () => {
    await db.query(`DELETE FROM comments where comment = $1`, [
      'Test gif comment'
    ]);
  });

  it('should add comment to gif post', async () => {
    const res = await request(app)
      .post('/api/v1/gifs/39/comment')
      .set('Authorization', token)
      .send({ comment: 'Test gif comment' });

    const { body, status } = res;
    expect(status).to.equal(201);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('comment');
    expect(body.data.message).to.contain('comment successfully posted');
  });

  it('should return an error when user attempts to add comment to non-existent gif', async () => {
    const res = await request(app)
      .post('/api/v1/gifs/0/comment')
      .set('Authorization', token)
      .send({ comment: 'Test gif comment' });

    const { body, status } = res;
    expect(status).to.equal(500);
    expect(body.status).to.contain('error');
  });
});

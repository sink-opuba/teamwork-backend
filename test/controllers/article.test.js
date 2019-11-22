const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/index');
const { token, differentToken } = require('../auth_token');

describe('POST /articles', function() {
  before(async () => {
    await db.query(`DELETE FROM articles where title = $1`, ['Test artilce']);
  });

  it('should create a new article', async () => {
    const data = {
      title: 'Test artilce',
      article: 'An article for cool unit testing'
    };
    const res = await request(app)
      .post('/api/v1/articles')
      .set('Authorization', token)
      .send(data);

    const { body } = res;
    expect(res.status).to.equal(201);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('articleId');
    expect(body.data.message).to.contain('Article successfully posted');
  });

  it('should return an error if article request body is empty', async () => {
    const data = {
      title: '',
      article: ''
    };
    const res = await request(app)
      .post('/api/v1/articles')
      .set('Authorization', token)
      .send(data);

    const { body } = res;
    expect(res.status).to.equal(400);
    expect(body.status).to.contain('error');
    expect(body.error).to.contain('Invalid request body');
  });
});

describe('PATCH /articles/:articleId', () => {
  let articleid;
  before(async () => {
    const response = await db.query(`SELECT * FROM articles where title = $1`, [
      'Test artilce'
    ]);
    articleid = response.rows[0].articleid;
  });

  it('should update the article in the database', async () => {
    const data = {
      title: 'Test artilce',
      article: 'THE test article is up-to-date.'
    };
    const res = await request(app)
      .patch(`/api/v1/articles/${articleid}`)
      .set('Authorization', token)
      .send(data);

    const { body } = res;
    expect(res.status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data.message).to.contain('Article successfully updated');
    expect(body.data).to.contain.property('updatedOn');
  });
});

describe('GET /articles/:articleId', () => {
  let articleid;
  before(async () => {
    const response = await db.query(`SELECT * FROM articles where title = $1`, [
      'Test artilce'
    ]);
    articleid = response.rows[0].articleid;
  });

  it('should get specific article with details and associated comments', async () => {
    const res = await request(app)
      .get(`/api/v1/articles/${articleid}`)
      .set('Authorization', token)
      .send();
    const { body, status } = res;
    expect(status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('comments');
    expect(body.data.comments).to.be.an('array');
  });

  it('should return an error when user attempts to get details and associated comments of non-exitent article', async () => {
    const res = await request(app)
      .get('/api/v1/articles/0')
      .set('Authorization', token)
      .send();
    const { body, status } = res;
    expect(status).to.equal(404);
    expect(body.status).to.contain('error');
    expect(body.error).to.contain('Article not found');
  });
});

describe('DELETE /articles/:articleId', () => {
  let articleid;
  before(async () => {
    const response = await db.query(`SELECT * FROM articles where title = $1`, [
      'Test artilce'
    ]);
    articleid = response.rows[0].articleid;
  });

  it("should return 401 error if user attempts to delete another user's article", async () => {
    const res = await request(app)
      .delete(`/api/v1/articles/${articleid}`)
      .set('Authorization', differentToken)
      .send();
    const { body, status } = res;
    expect(status).to.equal(401);
    expect(body.status).to.contain('error');
    expect(body.error).to.contain(
      "You're not authorised to delete this resource."
    );
  });

  it('should delete the article from the database', async () => {
    const res = await request(app)
      .delete(`/api/v1/articles/${articleid}`)
      .set('Authorization', token)
      .send();

    const { body } = res;
    expect(res.status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data.message).to.contain('Article successfully deleted');
  });
});

describe('POST /:articleid/comment', () => {
  before(async () => {
    await db.query(`DELETE FROM comments where comment = $1`, ['Test comment']);
  });

  it('should add comment to article post', async () => {
    const res = await request(app)
      .post('/api/v1/articles/3/comment')
      .set('Authorization', token)
      .send({ comment: 'Test comment' });

    const { body, status } = res;
    expect(status).to.equal(201);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('comment');
    expect(body.data.message).to.contain('comment successfully posted');
  });

  it('should return an error when user attempts to add comment to non-existent article', async () => {
    const res = await request(app)
      .post('/api/v1/articles/0/comment')
      .set('Authorization', token)
      .send({ comment: 'Test comment' });

    const { body, status } = res;
    expect(status).to.equal(500);
    expect(body.status).to.contain('error');
  });
});

describe('GET /articles/:articleId', () => {
  it('should get specific article with details and associated comments', async () => {
    const res = await request(app)
      .get('/api/v1/articles/3')
      .set('Authorization', token)
      .send();
    const { body, status } = res;
    expect(status).to.equal(200);
    expect(body.status).to.contain('success');
    expect(body.data).to.contain.property('comments');
    expect(body.data.comments).to.be.an('array');
  });

  it('should return an error when user attempts to get details and associated comments of non-exitent article', async () => {
    const res = await request(app)
      .get('/api/v1/articles/0')
      .set('Authorization', token)
      .send();
    const { body, status } = res;
    expect(status).to.equal(404);
    expect(body.status).to.contain('error');
    expect(body.error).to.contain('Article not found');
  });
});

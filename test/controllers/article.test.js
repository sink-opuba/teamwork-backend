const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/index');

const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMzA4Zjg3ZS1mODRkLTQ0NzktODBjZS1lNjhiNmI3NzFlZjMiLCJlbWFpbCI6InRyQHRlc3QuY29tIiwiaWF0IjoxNTc0MTczMjI5LCJleHAiOjE1NzQyNTk2Mjl9.26LS00-L_xm8JgKVndEkU6cNhrn_X_TT9cNXOd90_Rk';

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

describe('DELETE /articles/:articleId', () => {
  let articleid;
  before(async () => {
    const response = await db.query(`SELECT * FROM articles where title = $1`, [
      'Test artilce'
    ]);
    articleid = response.rows[0].articleid;
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

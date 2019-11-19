const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const db = require('../../db/index');

xdescribe('POST /articles', function() {
  before(async () => {
    await db.query(`DELETE FROM articles where title = $1`, ['Test artilce']);
  });
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMzA4Zjg3ZS1mODRkLTQ0NzktODBjZS1lNjhiNmI3NzFlZjMiLCJlbWFpbCI6InRyQHRlc3QuY29tIiwiaWF0IjoxNTc0MTczMjI5LCJleHAiOjE1NzQyNTk2Mjl9.26LS00-L_xm8JgKVndEkU6cNhrn_X_TT9cNXOd90_Rk';
  xit('should create a new article', async () => {
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

  xit('should return an errro if article request body is empty', async () => {
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

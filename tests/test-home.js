const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index.ts');
const utils = require('./utils.js');

chai.use(chaiHttp);
chai.should();

describe('Home', () => {
  describe('GET / unauthenticated', () => {
    it('should return valid page', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should show the login form', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.text.should.include('<form action="/login" method="POST"');
          res.text.should.include('<input name="username"');
          res.text.should.include('<button class="button" id="primary_email_button">');
          done();
        });
    });
  });
  describe('GET / authenticated', () => {
    it('should redirect to community page', (done) => {
      chai.request(app)
        .get('/')
        .set('Cookie', `token=${utils.getJWT('membre.actif')}`)
        .redirects(0)
        .end((err, res) => {
          res.should.have.status(302);
          res.headers.location.should.equal('/community');
          done();
        });
    });
  });
});

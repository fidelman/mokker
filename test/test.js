const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should(); // eslint-disable-line
const baseUrl = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Test the Rest server', () => { // eslint-disable-line
  it('simple GET server', (done) => { // eslint-disable-line
    chai.request(baseUrl)
      .get('/test/get')
      .end((err, res) => {
        res.should.have.status(200);
        chai.assert.deepEqual(res.body, {
          'simple-json': true,
          obj: {
            hi: '1',
            hello: {
              1: 2
            }
          }
        });
        done();
      });
  });

  it('simple POST server', (done) => { // eslint-disable-line
    const body = { 'simple-json': true };

    chai.request(baseUrl)
      .post('/test/post')
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        chai.assert.deepEqual(res.body, body);
        done();
      });
  });
});

describe('documentation', () => {
  it('create the formatted object for documentation', () => {
    const expected = {
      '@m_result': { value: 3 },
      '@m_docs': {
        merged: { value: 3 },
        objs: [{ value: 1 }, { value: 2 }, { value: 3 }]
      }
    };

    const actual = ternary({
      condition: 'x' === '1',
      iftrue: { value: 1 },
      iffalse: ternary({
        condition: 'x' === '2',
        iftrue: { value: 2 },
        iffalse: { value: 3 }
      })
    });

    chai.assert.deepEqual(actual, expected);
  });
});

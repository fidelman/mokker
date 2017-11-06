const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const baseUrl = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Test the Rest server', () => {
    it('simple GET server', (done) => {
        chai.request(baseUrl)
            .get('/test/get')
            .end((err, res) => {
                res.should.have.status(200);
                chai.assert.deepEqual(res.body, { "simple-json": true });
                done();
            });
    });

    it('GET condition @x=1', (done) => {
        chai.request(baseUrl)
            .get('/test/condition?@x=1')
            .end((err, res) => {
                res.should.have.status(200);
                chai.assert.deepEqual(res.body, { "value": 1 });
                done();
            });
    });

    it('GET condition @x=2', (done) => {
        chai.request(baseUrl)
            .get('/test/condition?@x=2')
            .end((err, res) => {
                res.should.have.status(200);
                chai.assert.deepEqual(res.body, { "value": 2 });
                done();
            });
    });

    it('GET condition @x=3', (done) => {
        chai.request(baseUrl)
            .get('/test/condition?@x=3')
            .end((err, res) => {
                res.should.have.status(200);
                chai.assert.deepEqual(res.body, { "message": "reject" });
                done();
            });
    });

    it('simple POST server', (done) => {
        const body = { "simple-json": true };

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
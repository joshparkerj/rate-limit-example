const http = require('http');
const { assert } = require('chai');

const server = require('../server');
const port = require('../port.json');

describe('api home test', () => {
  let appServer;

  before((done) => {
    appServer = server.start(() => done());
  });

  it('should respond', (done) => {
    http.get(`http://localhost:${port}/api/`, (res) => {
      if (res.statusCode === 200) {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          assert(rawData === 'api home');
          done();
        });
      } else {
        throw new Error('status code not ok');
      }
    });
  });

  it('should be rate limited', (done) => {
    let count = 0;
    const isRateLimited = (res) => {
      if (res.statusCode === 429) {
        done();
      } else {
        count += 1;
        if (count === 2) {
          throw new Error('not rate limited');
        }
      }
    };

    http.get(`http://localhost:${port}/api/`, isRateLimited);
  });

  after(() => {
    appServer.close();
  });
});

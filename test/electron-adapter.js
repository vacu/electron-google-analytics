import * as http from 'http';
import chai from 'chai';

const expect = chai.expect;

describe('Electron adapter', () => {
  if (process.env.USE_ELECTRON_NET) {
    const adapter = require('../lib/electron-adapter');

    let server;
    const connections = new Set();

    beforeEach((done) => {
      server = http.createServer();
      server.listen(0, '127.0.0.1', () => {
        server.url = `http://127.0.0.1:${server.address().port}`;
        done();
      });
      server.on('connection', (connection) => {
        connections.add(connection);
        connection.once('close', () => {
          connections.delete(connection);
        });
      });
    });

    afterEach((done) => {
      for (const connection of connections) {
        connection.destroy();
      }
      server.close(() => {
        server = null;
        done();
      });
    });

    it('should post the correct form data', (done) => {
      const requestUrl = '/requestUrl';
      const bodyData = 'v=1&t=pageview&dh=http%3A%2F%2Fexample.com&dp=%2Ftest&dt=Test';

      server.on('request', (request, response) => {
        let postedBodyData = '';
        expect(request.url).to.equal(requestUrl);
        expect(request.method).to.equal('POST');

        request.on('data', (chunk) => {
          postedBodyData += chunk.toString();
        });

        request.on('end', () => {
          expect(postedBodyData).to.equal(bodyData);

          response.statusCode = 200;
          response.setHeader('content-type', 'application/json');
          response.write('response');
          response.end();
        });
      });

      const form = {
        v: 1,
        t: 'pageview',
        dh: 'http://example.com',
        dp: '/test',
        dt: 'Test'
      };

      const request = adapter.default({});
      request.post(
        {
          url: `${server.url}${requestUrl}`,
          form
        },
        (err, response, body) => {
          expect(err).to.equal(null);
          expect(response.headers['content-type']).to.equal('application/json');
          expect(response.statusCode).to.equal(200);
          expect(body).to.equal('response');
          done();
        }
      );
    });
  }
});

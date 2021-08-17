'use strict';

const test = require('tap').test;
const httpServer = require('../lib/http-server');
const root = `${__dirname}/public`;
const request = require('request');

const promisify = require('util').promisify;

const requestAsync = promisify(request);

test('http-server https', (t) => {
  return new Promise((resolve) => {
    const server = httpServer.createServer({
      root,
      https: {
        cert: `${__dirname}/https/localhost.crt`,
        key: `${__dirname}/https/localhost.key`,
      },
      proxy: 'https://localhost:8090',
    });

    server.listen(8090, async () => {
      try {
        await Promise.all([
          requestAsync('https://localhost:8090').then((res) => {
            t.equal(res.statusCode, 200);
          }),

          requestAsync('https://localhost:8090/foobar').then((res) => {
            t.equal(res.statusCode, 200);
          }),
        ]);
      } catch (err) {
        t.fail(err.toString());
      } finally {
        server.close();
        resolve();
      }
    });
  });
});

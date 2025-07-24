import { expect } from 'chai';
import request from 'supertest';
import { endpointValidateInput, server } from '../server.js';

describe('POST /check', () => {
  it('should respond with submitted input when valid', async () => {
    const res = await request(server)
      .post('/check')
      .type('form')
      .send({ userInput: 'hi' });

    expect(res.status).to.equal(200);
    expect(res.text).to.equal('You submitted: hi');
  });

  it('should reject invalid input', async () => {
    const res = await request(server)
      .post('/check')
      .type('form')
      .send({ userInput: 'bye' });

    expect(res.status).to.equal(400);
    expect(res.text).to.equal('Invalid input');
  });

  after(() => {
    server.close();
  });
});

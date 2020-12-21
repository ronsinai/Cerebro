const Axios = require('axios');
const { expect } = require('chai');

describe('Server Routes', () => {
  describe('GET /health', () => {
    it('should start server', async () => {
      const result = await Axios.get('/');
      const health = result.data;
      expect(health).to.be.an('object');
      expect(health).to.have.property('status', true);
      expect(health).to.have.property('response', 'App and Running!');
    });
  });
});

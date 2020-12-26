const Chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Nconf = require('nconf');
const Sinon = require('sinon');
const SinonChai = require('sinon-chai');

Chai.use(chaiAsPromised);
Chai.use(SinonChai);
const { expect } = Chai;

const exampleImaging = require('../data/imaging');
const { getMQ } = require('../../server/utils/mq');
const { ImagingsCollection } = require('../../server/collections');

describe('Imagings Collection', () => {
  before(() => {
    this.imagings = new ImagingsCollection();
    this.mq = getMQ();

    this.exampleImaging = exampleImaging;
    this.badImaging = { _id: 'partial' };
  });

  describe('#diagnose', () => {
    it('should pass imaging insertion to diagnose', async () => {
      const spy = Sinon.spy(this.mq, 'publish');
      await this.imagings.diagnose(this.exampleImaging);

      const bufferedExampleImaging = Buffer.from(JSON.stringify(this.exampleImaging));
      const key = this.imagings._getRoutingKey(this.exampleImaging);
      expect(spy).to.have.been.calledOnceWithExactly(Nconf.get('AMQP_EXCHANGE'), key, bufferedExampleImaging, { persistent: true });
      spy.restore();
    });

    it('should fail partial imaging', async () => {
      await expect(this.imagings.diagnose(this.badImaging)).to.be.rejectedWith('"type" is required');
    });

    it('should create correct pattern', () => {
      const pattern = this.imagings._getRoutingKey(this.exampleImaging);
      expect(pattern).to.equal('MRI.chest.F');
    });
  });
});

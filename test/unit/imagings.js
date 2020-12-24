const Chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Sinon = require('sinon');
const SinonChai = require('sinon-chai');

Chai.use(chaiAsPromised);
Chai.use(SinonChai);
const { expect } = Chai;

const Diagnoses = require('../../server/diagnoses');
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
      const exampleDiagnoses = Diagnoses[this.exampleImaging.type];
      const spy = Sinon.spy(this.mq, 'sendToQueue');

      const diagnoses = await this.imagings.diagnose(this.exampleImaging);
      expect(diagnoses).to.be.an('array');
      expect(diagnoses).to.eql(exampleDiagnoses);

      expect(spy.callCount).to.equal(exampleDiagnoses.length);
      const bufferedExampleImaging = Buffer.from(JSON.stringify(this.exampleImaging));
      diagnoses.forEach((diagnosis) => {
        // eslint-disable-next-line max-len
        expect(spy).to.have.been.calledWithExactly(diagnosis, bufferedExampleImaging, { persistent: true });
      });

      spy.restore();
    });

    it('should fail partial imaging', async () => {
      await expect(this.imagings.diagnose(this.badImaging)).to.be.rejectedWith('"type" is required');
    });
  });
});

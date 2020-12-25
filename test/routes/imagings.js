const Axios = require('axios');
const Chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

Chai.use(chaiAsPromised);
const { expect } = Chai;

const exampleImaging = require('../data/imaging');
const { ImagingsCollection } = require('../../server/collections');

describe('Imagings Routes', () => {
  before(() => {
    this.imagings = new ImagingsCollection();

    this.exampleImaging = exampleImaging;
    this.badImaging = { _id: 'partial' };
  });

  describe('POST /imagings/{id}/diagnoses', () => {
    it('should post imaging to diagnose', async () => {
      const exampleDiagnoses = await this.imagings.redis.getMembers(this.exampleImaging.type);
      const result = await Axios.post(`/imagings/${this.exampleImaging._id}/diagnoses`, this.exampleImaging);
      const diagnoses = result.data;
      expect(diagnoses).to.be.an('array');
      expect(diagnoses).to.eql(exampleDiagnoses);
    });

    it('should fail partial imaging', async () => {
      await expect(Axios.post(`/imagings/${this.badImaging._id}/diagnoses`, this.badImaging)).to.be.rejectedWith('Request failed with status code 400');
    });

    it('should update diagnoses in diagnosis', async () => {
      const update = 'example_diagnosis';
      this.imagings.redis.setMembers(this.exampleImaging.type, update);

      const exampleDiagnoses = await this.imagings.redis.getMembers(this.exampleImaging.type);
      const result = await Axios.post(`/imagings/${this.exampleImaging._id}/diagnoses`, this.exampleImaging);
      const diagnoses = result.data;
      expect(diagnoses).to.be.an('array');
      expect(diagnoses).to.eql(exampleDiagnoses);
      expect(diagnoses).to.contain(update);
    });
  });
});

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
      await Axios.post(`/imagings/${this.exampleImaging._id}/diagnoses`, this.exampleImaging);
    });

    it('should fail partial imaging', async () => {
      await expect(Axios.post(`/imagings/${this.badImaging._id}/diagnoses`, this.badImaging)).to.be.rejectedWith('Request failed with status code 400');
    });
  });
});

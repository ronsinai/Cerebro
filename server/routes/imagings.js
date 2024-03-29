const ExpressJoi = require('express-joi-validation');
const { Router } = require('express');

const { getLogger } = require('../utils/logger');
const { ImagingsCollection } = require('../collections');
const { imagingSchema } = require('../schemas');

const imagings = new ImagingsCollection();
const logger = getLogger();
const router = Router();
const validator = ExpressJoi.createValidator();

router.post('/:id/diagnoses', validator.body(imagingSchema), async (req, res, next) => {
  const imagingId = req.params.id;
  const imaging = req.body;
  logger.info(`Requested to diagnose imaging ${imagingId}`);

  try {
    await imagings.diagnose(imaging);
    res.send();
  }
  catch (err) {
    res.status(400).send(err);
  }

  return next();
});

module.exports = router;

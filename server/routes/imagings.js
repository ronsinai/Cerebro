const ExpressJoi = require('express-joi-validation');
const { Router } = require('express');

const { ImagingsCollection } = require('../collections');
const { imagingSchema } = require('../schemas');

const imagings = new ImagingsCollection();
const router = Router();
const validator = ExpressJoi.createValidator();

router.post('/:id/diagnoses', validator.body(imagingSchema), async (req, res, next) => {
  const imagingId = req.params.id;
  const imaging = req.body;
  console.info(`Requested to diagnose imaging ${imagingId}`);

  try {
    const diagnoses = await imagings.diagnose(imaging);
    res.send(diagnoses);
    console.info(`Responded with potential diagnoses of imaging ${imagingId}: ${diagnoses}`);
  }
  catch (err) {
    res.status(400).send(err);
  }

  return next();
});

module.exports = router;

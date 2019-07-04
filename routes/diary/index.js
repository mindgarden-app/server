var express = require('express');
var router = express.Router();

router.use('/complete', require('./complete'));
router.use('/save', require('./save'));

module.exports = router;

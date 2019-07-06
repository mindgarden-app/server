var express = require('express');
var router = express.Router();

router.use('/', require('./garden'));
router.use('/plant', require('./plant'));

module.exports = router;

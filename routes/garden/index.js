var express = require('express');
var router = express.Router();

router.use('/month', require('./month'));
router.use('/garden', require('./garden'));
router.use('/plant', require('./plant'));

module.exports = router;

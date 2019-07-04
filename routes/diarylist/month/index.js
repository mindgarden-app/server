var express = require('express');
var router = express.Router();

router.use('/left', require('./left'));
router.use('/right', require('./right'));

module.exports = router;

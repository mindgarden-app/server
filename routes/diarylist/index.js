var express = require('express');
var router = express.Router();

router.use('/month', require('./month'));
router.use('/click', require('./click'));
router.use('/delete', require('./delete'));
router.use('/settings', require('./settings'));
router.use('/sort', require('./sort'));

module.exports = router;

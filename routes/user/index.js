var express = require('express');
var router = express.Router();

router.use('/signin', require('./signin'));
router.use('/signup', require('./signup'));
router.use('/refresh', require('./refresh'));
router.use('/delete', require('./delete'));
router.use('/mail', require('./mail'));

module.exports = router;

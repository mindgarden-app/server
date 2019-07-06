var express = require('express');
var router = express.Router();

router.use('/', require('./diarylist'));
router.use('/click', require('./click'));
router.use('/delete', require('./delete'));
router.use('/sort', require('./sort'));

module.exports = router;

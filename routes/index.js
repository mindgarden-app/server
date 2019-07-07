var express = require('express');
var router = express.Router();

router.use('/alarm', require('./alarm'));
router.use('/diary', require('./diary'));
router.use('/diarylist', require('./diarylist'));
router.use('/garden', require('./garden'));
router.use('/user', require('./user'));
router.use('/scheduler', require('./scheduler'));

module.exports = router;

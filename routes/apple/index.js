var express = require('express');
var router = express.Router();

router.use('/signin', require('./signin'));

module.exports = router;

var express = require('express');
var router = express.Router();

router.use('/', require('./login'));


module.exports = router;

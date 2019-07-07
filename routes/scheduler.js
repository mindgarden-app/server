var express = require('express');
var router = express.Router();
const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const resMessage = require('../module/responseMessage');
const db = require('../module/pool');
const moment = require('moment');
const cron = require('node-cron');

cron.schedule('0 0 0 * * *', async() => {//자정에
    //모든 유저에 대해서 balloon table의 check=2, balloon=0으로 update
    const updateBalloonQuery = 'UPDATE balloon SET `check` = 2 , `balloon` = 0';
    const updateBalloonResult = await db.queryParam_None(updateBalloonQuery);
    console.log(updateBalloonResult);
})

module.exports = router;
var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');//post할때 필요
const moment = require('moment');

//메인
router.get('/:userIdx/:date', async(req, res)=>{
    const getGardenQuery = 'SELECT date, location, treeIdx, count(*) FROM garden WHERE userIdx=? AND date=?';
    date = new Date(req.params.date);//date 객체 되는지 확인하기
    const getGardenResult = await db.queryParam_Parse(getGardenQuery,[req.params.userIdx, date]);
    if (getGardenResult.length == 0) {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GARDEN_SELECT_FAIL));
    } else {
        const getBalloonQuery = 'SELECT balloon FROM balloon WHERE userIdx = ?';
        const getBalloonResult = await db.queryParam_Parse(getBalloonQuery ,[req.params.userIdx]);
        if (getBalloonResult.length == 0) {//garden 성공, balloon 실패
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.GARDEN_FAIL));
        } else {//둘 다 성공
            getBalloonResult.push(getBalloonResult[0]['balloon']);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.GARDEN_SUCCESS, getBalloonResult));
        }
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();

const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');


//URI: diarylist/click
router.get('/', async(req, res) => {
    try{
        const diaryIdx=req.body.diaryIdx;
        const userIdx = req.body.userIdx;
        const date = req.body.date;
        const getDiaryQuery = 'SELECT * FROM diary JOIN weather ON weather.weatherIdx = diary.weatherIdx WHERE diaryIdx = ?';
        const getDiaryResult = await db.queryParam_Arr(getDiaryQuery, diaryIdx);

            if (!getDiaryResult) {
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DIARY_SELECT_FAIL));
            } else {
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_SELECT_SUCCESS,getDiaryResult));
                console.log(getDiaryResult);
            }
        }catch(err){
            console.log(err);
        }
});

module.exports = router;
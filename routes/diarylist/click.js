var express = require('express');
var router = express.Router();

const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const authUtil = require("../../module/authUtils");

//URI: diarylist/click
router.get('/:diaryIdx', authUtil.isLoggedin, async(req, res) => {
    try{
        const userIdx = req.decoded.idx;
        const diaryIdx = req.params.diaryIdx;
        const getDiaryQuery = 'SELECT * FROM diary WHERE userIdx = ? AND diaryIdx = ?';
        const getDiaryResult = await db.queryParam_Parse(getDiaryQuery, [userIdx, diaryIdx]);

            if (getDiaryResult==0) {
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
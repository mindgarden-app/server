var express = require('express');
var router = express.Router();

const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const authUtil = require("../../module/authUtils");

//URI: diarylist/delete
router.delete('/:date', authUtil.isLoggedin, async (req, res) => {
    try{
        const userIdx = req.decoded.idx;
        const date = req.params.date;

        const deleteDiary = 'DELETE FROM diary WHERE userIdx= ? AND date LIKE ? ';

        const deleteDiaryResult = await db.queryParam_Parse(deleteDiary, [userIdx, date+'%'] );

        if (!userIdx|!date) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DIARY_DELETE_FAIL));
        } else {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_DELETE_SUCCESS));
        }
    }catch(err){
        console.log(err);
    }
});

module.exports = router;
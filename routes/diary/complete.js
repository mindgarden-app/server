var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');
const moment = require('moment');

//완료 버튼-->수정 시 시간은 update하지 말기
router.post('/', upload.single('diary_img'), async(req, res) => {
    const updateDiaryQuery = 'UPDATE diary SET diary_content = ?, weatherIdx = ?, diary_img = ? WHERE userIdx = ? AND date LIKE ?';
    const diary_img = req.file.location;
    const updateDiaryResult = await db.queryParam_Parse(updateDiaryQuery,[req.body.diary_content, req.body.weatherIdx, diary_img, req.body.userIdx, req.body.date+'%']);
    if (updateDiaryResult.changedRows == 0) { 
        console.log(1);
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.UPDATE_DIARY_FAIL));
    } else {
        console.log(2);
        const getDiaryQuery = 'SELECT diary_content, diary_img, weatherIdx, date FROM diary WHERE userIdx = ? AND date LIKE ?';
        const getDiaryResult=await db.queryParam_Parse(getDiaryQuery, [req.body.userIdx, req.body.date+'%']);
        if (getDiaryResult.length == 0) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DIARY_GET_FAIL));
        } else {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_GET_SUCCESS, getDiaryResult));
        }
    }
});

module.exports = router;
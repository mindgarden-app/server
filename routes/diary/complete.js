var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');
const authUtil = require("../../module/authUtils");

//완료 버튼-->수정 시 시간은 update하지 말기
router.put('/', upload.single('diary_img'), authUtil.isLoggedin, async(req, res) => {
    const updateDiaryQuery = 'UPDATE diary SET diary_content = ?, weatherIdx = ?, diary_img = ? WHERE userIdx = ? AND diaryIdx = ?';
    if(req.file == undefined){//이미지 없음
        const updateDiaryResult = await db.queryParam_Parse(updateDiaryQuery,[req.body.diary_content, req.body.weatherIdx, null, req.decoded.idx, req.body.diaryIdx]);
        if (updateDiaryResult.length == 0) { 
            console.log(1);
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.UPDATE_DIARY_FAIL));
        } else {
            console.log(2);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_UPDATE_SUCCESS));
            }
    } else {//이미지 있음
        const diary_img = req.file.location;
        const updateDiaryResult = await db.queryParam_Parse(updateDiaryQuery,[req.body.diary_content, req.body.weatherIdx, diary_img, req.decoded.idx, req.body.diaryIdx]);
        if (updateDiaryResult.length == 0) { 
            console.log(3);
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.UPDATE_DIARY_FAIL));
        } else {
            console.log(4);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_UPDATE_SUCCESS));
            }
        }
});

module.exports = router;
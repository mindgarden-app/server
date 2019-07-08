var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');
const moment = require('moment');

//등록 버튼
router.post('/', upload.single('diary_img'), async(req, res) => {
    const selectCheckQuery = 'SELECT `check` FROM balloon WHERE userIdx = ?';
    const selectCheckResult = await db.queryParam_Parse(selectCheckQuery,[req.body.userIdx]);
    if (selectCheckResult.length == 0) {//새로운 유저-->등록 성공(insert)-->diary insert, balloon insert
        const insertDiaryQuery = 'INSERT INTO diary (date, diary_content, weatherIdx, userIdx, diary_img) VALUES (?, ?, ?, ?, ?)';
        const insertBalloonQuery = 'INSERT INTO balloon (userIdx, `check`, balloon) VALUES (?, ?, ?)';
        const insertTransaction = await db.Transaction(async(connection) => {
            var diary_date = moment().format("YYYY-MM-DD ddd HH:mm:ss");//년, 월, 일, 요일, 시, 분, 초
            const diary_img = req.file.location;
            const insertDiaryResult = await db.queryParam_Parse(insertDiaryQuery, [diary_date, req.body.diary_content, req.body.weatherIdx, req.body.userIdx, diary_img]);
            const insertBalloonResult = await db.queryParam_Parse(insertBalloonQuery, [req.body.userIdx, 0, 1]);
        });
        if (!insertTransaction) {//새로운 유저 트랜잭션
            res.status(200).send(util.successFalse(statusCode.OK, resMessage.NEW_USER_FAIL));
        } else {
            const getDiaryQuery = 'SELECT diary_content, diary_img, weatherIdx, date FROM diary WHERE userIdx = ? AND date LIKE ?';
            var diary_date = moment().format("YYYY-MM-DD");//년, 월, 일
            const getDiaryResult=await db.queryParam_Parse(getDiaryQuery, [req.body.userIdx, diary_date+'%']);
            if (getDiaryResult.length == 0) {//트랜잭션 commit, get fail
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DIARY_GET_FAIL));
            } else {
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_GET_SUCCESS, getDiaryResult));
            }
        }
    } else {
        if(selectCheckResult[0]['check'] == 2){//기존 유저-->등록 성공(update)-->diary insert, balloon update
            const insertDiaryQuery = 'INSERT INTO diary (date, diary_content, weatherIdx, userIdx, diary_img) VALUES (?, ?, ?, ?, ?)';
            const updateBalloonQuery = 'UPDATE balloon SET `check`= 0 , `balloon`= 1 WHERE userIdx = ?';
            const insertTransaction_ = await db.Transaction(async(connection) => {
                var diary_date = moment().format("YYYY-MM-DD ddd HH:mm:ss");//년, 월, 일, 요일, 시, 분, 초
                const diary_img = req.file.location;
                const insertDiaryResult = await db.queryParam_Parse(insertDiaryQuery, [diary_date, req.body.diary_content, req.body.weatherIdx, req.body.userIdx, diary_img]);
                const updateBalloonResult = await db.queryParam_Parse(updateBalloonQuery, [req.body.userIdx]);
            });
            if (insertTransaction_ == 0) {//기존 유저 트랜잭션
                res.status(200).send(util.successFalse(statusCode.OK, resMessage.EXIST_USER_FAIL));
            } else {
                const getDiaryQuery = 'SELECT diary_content, diary_img, weatherIdx, date FROM diary WHERE userIdx = ? AND date LIKE ?';
                var diary_date = moment().format("YYYY-MM-DD");//년, 월, 일
                const getDiaryResult=await db.queryParam_Parse(getDiaryQuery, [req.body.userIdx, diary_date+'%']);
                if (getDiaryResult.length == 0) {//트랜잭션 commit, get fail
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.DIARY_GET_FAIL));
                } else {
                    res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_GET_SUCCESS, getDiaryResult));
                }
            }
        } else{
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.ALREADY_WRITE));
        }
    }
});


module.exports = router;
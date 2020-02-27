var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const authUtil = require("../../module/authUtils");


//등록 버튼
router.post('/', upload.single('diary_img'), authUtil.isLoggedin, async(req, res) => {
    const selectBalloonQuery = 'SELECT `balloon` FROM balloon WHERE userIdx = ?';
    const selectBalloonResult = await db.queryParam_Parse(selectBalloonQuery,[req.decoded.idx]);
    if (selectBalloonResult.length == 0) {//새로운 유저-->등록 성공(insert)-->diary insert, balloon insert
        const insertDiaryQuery = 'INSERT INTO diary (date, diary_content, weatherIdx, userIdx, diary_img) VALUES (?, ?, ?, ?, ?)';
        const insertBalloonQuery = 'INSERT INTO balloon (userIdx, balloon) VALUES (?, ?)';
        result = '';
        const insertTransaction = await db.Transaction(async(connection) => {
            if(req.file == undefined){
                var diary_date = moment().format("YYYY-MM-DD ddd HH:mm:ss");//년, 월, 일, 요일, 시, 분, 초
                const insertDiaryResult = await connection.query(insertDiaryQuery, [diary_date, req.body.diary_content, req.body.weatherIdx, req.decoded.idx, null]);
                result = insertDiaryResult['insertId'];
            } else{
                var diary_date = moment().format("YYYY-MM-DD ddd HH:mm:ss");//년, 월, 일, 요일, 시, 분, 초
                const diary_img = req.file.location;
                const insertDiaryResult = await connection.query(insertDiaryQuery, [diary_date, req.body.diary_content, req.body.weatherIdx, req.decoded.idx, diary_img]);
                result = insertDiaryResult['insertId'];
            }
            const insertBalloonResult = await connection.query(insertBalloonQuery, [req.decoded.idx, 1]);
        });
        if (insertTransaction != 'Success') {//새로운 유저 트랜잭션
            console.log("1");
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.NEW_USER_FAIL));
        } else {
            console.log("2");
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_SAVE_SUCCESS, result));
        }
    } else {//여기 부터~~~~~~~~~~~~~~~
        if(selectBalloonResult[0]['balloon'] == 1){//기존 유저-->등록 성공(update)-->diary insert, balloon update
            const insertDiaryQuery = 'INSERT INTO diary (date, diary_content, weatherIdx, userIdx, diary_img) VALUES (?, ?, ?, ?, ?)';
            const updateBalloonQuery = 'UPDATE balloon SET `balloon`= 1 WHERE userIdx = ?';
            result = '';
            const insertTransaction_ = await db.Transaction(async(connection) => {
                if(req.file == undefined){
                    var diary_date = moment().format("YYYY-MM-DD ddd HH:mm:ss");//년, 월, 일, 요일, 시, 분, 초
                    const insertDiaryResult = await connection.query(insertDiaryQuery, [diary_date, req.body.diary_content, req.body.weatherIdx, req.decoded.idx, null]);
                    result = insertDiaryResult['insertId'];
                } else{
                    var diary_date = moment().format("YYYY-MM-DD ddd HH:mm:ss");//년, 월, 일, 요일, 시, 분, 초
                    const diary_img = req.file.location;
                    const insertDiaryResult = await connection.query(insertDiaryQuery, [diary_date, req.body.diary_content, req.body.weatherIdx, req.decoded.idx, diary_img]);
                    result = insertDiaryResult['insertId'];
                }
                const updateBalloonResult = await connection.query(updateBalloonQuery, [req.decoded.idx]);
            });
            if (insertTransaction_ != 'Success') {//기존 유저 트랜잭션
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.EXIST_USER_FAIL));
            } else {
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_SAVE_SUCCESS, result));
            }
        }else if(selectBalloonResult[0]['balloon'] == 0){
            const insertDiaryQuery = 'INSERT INTO diary (date, diary_content, weatherIdx, userIdx, diary_img) VALUES (?, ?, ?, ?, ?)';
            const updateBalloonQuery = 'UPDATE balloon SET `balloon`= 0 WHERE userIdx = ?';
            result = '';
            const insertTransaction_ = await db.Transaction(async(connection) => {
                if(req.file == undefined){
                    var diary_date = moment().format("YYYY-MM-DD ddd HH:mm:ss");//년, 월, 일, 요일, 시, 분, 초
                    const insertDiaryResult = await connection.query(insertDiaryQuery, [diary_date, req.body.diary_content, req.body.weatherIdx, req.decoded.idx, null]);
                    result = insertDiaryResult['insertId'];
                } else{
                    var diary_date = moment().format("YYYY-MM-DD ddd HH:mm:ss");//년, 월, 일, 요일, 시, 분, 초
                    const diary_img = req.file.location;
                    const insertDiaryResult = await connection.query(insertDiaryQuery, [diary_date, req.body.diary_content, req.body.weatherIdx, req.decoded.idx, diary_img]);
                    result = insertDiaryResult['insertId'];
                }
                const updateBalloonResult = await connection.query(updateBalloonQuery, [req.decoded.idx]);
            });
            if (insertTransaction_ != 'Success') {//기존 유저 트랜잭션
                res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.EXIST_USER_FAIL));
            } else {
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.DIARY_SAVE_SUCCESS, result));
            }
        } else{
            res.status(200).send(util.successTrue(statusCode.NO_CONTENT, resMessage.ALREADY_WRITE));//안드 부탁...
        }
    }
});

module.exports = router;
var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');//post할때 필요
const moment = require('moment');

//심기
router.post('/', async(req, res) => {
        const getCheckQuery = 'SELECT `check` FROM balloon WHERE userIdx= ?';
        const getCheckResult = await db.queryParam_Parse(getCheckQuery,[req.body.userIdx]);
        if(getCheckResult.length == 0){//새로운 유저-->심을 수 없음
            console.log("new");
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.WRITE_DIARY));
        } else{
            if (getCheckResult[0]['check'] == '0') {//일기를 쓰고 안심음-->심을 수 있음
                const insertGardenQuery = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
                const garden_date = moment().format("YYYY-MM-DD ddd");
                const insertGardenResult = await db.queryParam_Parse(insertGardenQuery, [garden_date, req.body.location, req.body.treeIdx, req.body.userIdx]);
                if (insertGardenResult.length == 0) {
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GARDEN_INSERT_FAIL));
                } else {
                    //check=1, balloon=0로 update
                    const updateBalloonQuery = 'UPDATE balloon SET `check` = 1 , `balloon` = 0 WHERE userIdx = ?';
                    const updateBalloonResult = await db.queryParam_Parse(updateBalloonQuery,[req.body.userIdx]);
                    console.log(updateBalloonResult);
                    if (updateBalloonResult.length == 0) {
                        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.BALLOON_UPDATE_FAIL));
                    } else {//최종 성공
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.GARDEN_INSERT_SUCCESS, "{ balloon : 0 }"));
                    }
                }
            } else if(getCheckResult[0]['check'] == '1'){//일기를 쓰고 심음-->심을 수 없음
                console.log("1");
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.ALREADY_PLANT));
            } else if(getCheckResult[0]['check'] == '2'){//일기를 안썼음->심을 수 없음
                console.log("2");
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.WRITE_DIARY));
            }
        }
});


module.exports = router;
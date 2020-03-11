var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');
const moment = require('moment');
const authUtil = require("../../module/authUtils");

//메인
router.get('/:date', authUtil.isLoggedin, async(req, res)=>{
    try{
        const getGardenQuery = 'SELECT date, location, treeIdx FROM garden WHERE userIdx= ? AND date LIKE ?';
        const getGardenResult = await db.queryParam_Parse(getGardenQuery,[req.decoded.idx, req.params.date+'%']);
        if (getGardenResult.length == 0) {
            //잡초 심기
            console.log(1);
            const month = (req.params.date).split('-');
            console.log("month: ", month);
            if(month[1] == '02'){//3번 garden에 Insert
                console.log(2);
                const insertGardenQuery_1 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
                const insertGardenQuery_2 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
                const insertGardenQuery_3 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
                const insertTransaction = await db.Transaction(async(connection) => {
                    const insertGardenResult_1 = await connection.query(insertGardenQuery_1, [req.params.date+'-01 Mon', 5, 16, req.decoded.idx]);
                    const insertGardenResult_2 = await connection.query(insertGardenQuery_2, [req.params.date+'-01 Mon', 21, 16, req.decoded.idx]);
                    const insertGardenResult_3 = await connection.query(insertGardenQuery_3, [req.params.date+'-01 Mon', 30, 16, req.decoded.idx]);
                });
                if (insertTransaction == 0) {//잡초 insert fail
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GROSS_INSERT_FAIL));
                } else {
                    const getGardenQuery_ = 'SELECT date, location, treeIdx FROM garden WHERE userIdx= ? AND date LIKE ?';
                    const getGardenResult_ = await db.queryParam_Parse(getGardenQuery_,[req.decoded.idx, req.params.date+'%']);
                    if (getGardenResult_.length == 0) {//트랜잭션 성공, select 실패
                        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GARDEN_SELECT_FAIL));
                    } else {//최종 성공
                        for(i=0;i<getGardenResult_.length;i++){//balloon 추가
                            getGardenResult_[i]['balloon']=0;
                        }
                        for(i=0;i<getGardenResult_.length;i++){
                            getGardenResult_[i]['treeNum']=0;
                        }
                        // for(i=0;i<getGardenResult_.length;i++){
                        //     getGardenResult_[i]['check']=2;
                        // }
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.GROSS_INSERT_SUCCESS, getGardenResult_));
                    }
                }
            }
            if(month[1] == '04' || month[1] == '06' || month[1] == '09' || month[1] == '11'){//2번 garden에 insert
                console.log(3);
                const insertGardenQuery_1 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
                const insertGardenQuery_2 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
                const insertTransaction = await db.Transaction(async(connection) => {
                    const insertGardenResult_1 = await connection.query(insertGardenQuery_1, [req.params.date+'-01 Mon', 21, 16, req.decoded.idx]);
                    const insertGardenResult_2 = await connection.query(insertGardenQuery_2, [req.params.date+'-01 Mon', 30, 16, req.decoded.idx]);
                });
                if (insertTransaction == 0) {//잡초 insert fail
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GROSS_INSERT_FAIL));
                } else {
                    const getGardenQuery_ = 'SELECT date, location, treeIdx FROM garden WHERE userIdx= ? AND date LIKE ?';
                    const getGardenResult_ = await db.queryParam_Parse(getGardenQuery_,[req.decoded.idx, req.params.date+'%']);
                    if (getGardenResult_.length == 0) {//트랜잭션 성공, select 실패
                        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GARDEN_SELECT_FAIL));
                    } else {//최종 성공
                        for(i=0;i<getGardenResult_.length;i++){//balloon 추가
                            getGardenResult_[i]['balloon']=0;
                        }
                        for(i=0;i<getGardenResult_.length;i++){
                            getGardenResult_[i]['treeNum']=0;
                        }
                        // for(i=0;i<getGardenResult_.length;i++){
                        //     getGardenResult_[i]['check']=2;
                        // }
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.GROSS_INSERT_SUCCESS, getGardenResult_));
                    }
                }
            }
            if(month[1] == '01' || month[1] == '03' || month[1] == '05' || month[1] == '07' || month[1] == '08' || month[1] == '10' || month[1] == '12'){//1번 garden에 insert
                console.log(4);
                const insertGardenQuery_1 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
                const insertTransaction = await db.Transaction(async(connection) => {
                    const insertGardenResult_1 = await connection.query(insertGardenQuery_1, [req.params.date+'-01 Mon', 30, 16, req.decoded.idx]);
                });
                if (insertTransaction == 0) {//잡초 insert fail
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GROSS_INSERT_FAIL));
                } else {
                    const getGardenQuery_ = 'SELECT date, location, treeIdx FROM garden WHERE userIdx= ? AND date LIKE ?';
                    const getGardenResult_ = await db.queryParam_Parse(getGardenQuery_,[req.decoded.idx, req.params.date+'%']);
                    if (getGardenResult_.length == 0) {//트랜잭션 성공, select 실패
                        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GARDEN_SELECT_FAIL));
                    } else {//최종 성공
                        for(i=0;i<getGardenResult_.length;i++){//balloon 추가
                            getGardenResult_[i]['balloon']=0;
                        }
                        for(i=0;i<getGardenResult_.length;i++){
                            getGardenResult_[i]['treeNum']=0;
                        }
                        // for(i=0;i<getGardenResult_.length;i++){
                        //     getGardenResult_[i]['check']=2;
                        // }
                        res.status(200).send(util.successTrue(statusCode.OK, resMessage.GROSS_INSERT_SUCCESS, getGardenResult_));
                    }
                }
            }
        } else if(getGardenResult[(getGardenResult.length)-1]['treeIdx'] > 15){//잡초만 있는 경우 
            const getBalloonQuery = 'SELECT balloon FROM balloon WHERE userIdx = ?';
            const getBalloonResult = await db.queryParam_Parse(getBalloonQuery ,[req.decoded.idx]);
            if (getBalloonResult.length == 0) {//완전 처음 쓰는 사람
                for(i=0;i<getGardenResult.length;i++){//balloon 추가
                    getGardenResult[i]['balloon']=0;
                }
                for(i=0;i<getGardenResult.length;i++){
                    getGardenResult[i]['treeNum']=0;
                }
                // for(i=0;i<getGardenResult.length;i++){
                //     getGardenResult[i]['check']=2;
                // }
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.GARDEN_SUCCESS, getGardenResult));
            } else {
                for(i=0;i<getGardenResult.length;i++){//balloon 추가
                    getGardenResult[i]['balloon']=getBalloonResult[0]['balloon'];
                }
                for(i=0;i<getGardenResult.length;i++){
                    getGardenResult[i]['treeNum']=0;
                }
                // for(i=0;i<getGardenResult.length;i++){
                //     getGardenResult[i]['check']=getBalloonResult[0]['check'];
                // }
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.GARDEN_SUCCESS, getGardenResult));
            }
        } else {
            const getBalloonQuery = 'SELECT balloon FROM balloon WHERE userIdx = ?';
            const getBalloonResult = await db.queryParam_Parse(getBalloonQuery ,[req.decoded.idx]);
            if (getBalloonResult.length == 0) {//garden 성공, balloon 실패
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.BALLOON_SELECT_FAIL));
            } else {
                const getTreeNumQuery = 'SELECT count(*) AS treeNum FROM garden WHERE userIdx = ? AND treeIdx <= 15 AND date LIKE ?';
                const getTreeNumResult = await db.queryParam_Parse(getTreeNumQuery ,[req.decoded.idx, req.params.date+'%']);
                if(getTreeNumResult.length == 0){
                    res.status(200).send(util.successTrue(statusCode.OK, resMessage.TREENUM_FAIL));
                } else{//셋 다 성공
                    for(i=0;i<getGardenResult.length;i++){//balloon 추가
                        getGardenResult[i]['balloon']=getBalloonResult[0]['balloon'];
                    }
                    for(i=0;i<getGardenResult.length;i++){
                        getGardenResult[i]['treeNum']=getTreeNumResult[0]['treeNum'];
                    }
                    // for(i=0;i<getGardenResult.length;i++){
                    //     getGardenResult[i]['check']=getBalloonResult[0]['check'];
                    // }
                    res.status(200).send(util.successTrue(statusCode.OK, resMessage.GARDEN_SUCCESS, getGardenResult));
                }
                //getGardenResult[0]['balloon']=getBalloonResult[0]['balloon'];
                //getGardenResult.push({"balloon": getBalloonResult[0]['balloon']});
            }
        }
    }catch(err){
        console.log(err);
    }
});

module.exports = router;
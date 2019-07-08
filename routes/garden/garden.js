var express = require('express');
var router = express.Router();
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');
const moment = require('moment');

//메인
router.get('/:userIdx/:date', async(req, res)=>{
    try{
        const getGardenQuery = 'SELECT date, location, treeIdx FROM garden WHERE userIdx= ? AND date LIKE ?';
        const getGardenResult = await db.queryParam_Parse(getGardenQuery,[req.params.userIdx, req.params.date+'%']);
        if (getGardenResult.length == 0) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.GARDEN_SELECT_FAIL));
        } else {
            const getBalloonQuery = 'SELECT balloon FROM balloon WHERE userIdx = ?';
            const getBalloonResult = await db.queryParam_Parse(getBalloonQuery ,[req.params.userIdx]);
            if (getBalloonResult.length == 0) {//garden 성공, balloon 실패
                res.status(200).send(util.successTrue(statusCode.OK, resMessage.BALLOON_SELECT_FAIL));
            } else {
                const getTreeNumQuery = 'SELECT count(*) AS treeNum FROM garden WHERE userIdx = ? AND date LIKE ?';
                const getTreeNumResult = await db.queryParam_Parse(getTreeNumQuery ,[req.params.userIdx, req.params.date+'%']);
                if(getTreeNumResult.length == 0){
                    res.status(200).send(util.successTrue(statusCode.OK, resMessage.TREENUM_FAIL));
                } else{//셋 다 성공
                    for(i=0;i<getGardenResult.length;i++){//balloon 추가
                        getGardenResult[i]['balloon']=getBalloonResult[0]['balloon'];
                    }
                    for(i=0;i<getGardenResult.length;i++){
                        getGardenResult[i]['treeNum']=getTreeNumResult[0]['treeNum'];
                    }
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
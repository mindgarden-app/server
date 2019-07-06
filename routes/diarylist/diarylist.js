var express = require('express');
var router = express.Router();
const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');

router.get('/', async(req, res) => {
    try{
        const userIdx = req.body.userIdx;
        const date = req.body.date;
        const selectEpisodeCmtQuery = 'SELECT * FROM diary WHERE wpIdx = ? ORDER BY writetime DESC';
        const selectEpisodeCmtResult = await db.queryParam_Arr(selectEpisodeCmtQuery, [req.params.epIdx]);

            if (!selectEpisodeCmtResult) {
                res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.CMT_DB_SELECT_ERROR));
            } else {
                res.status(200).send(utils.successTrue(statusCode.OK, resMessage.COMMENT_SELECTED, selectEpisodeCmtResult));
            }
        }catch(err){
            console.log(err);
        }
});

module.exports = router;
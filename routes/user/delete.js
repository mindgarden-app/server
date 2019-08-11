var express = require('express');
var router = express.Router();

const db = require('../../module/pool');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const authUtil = require("../../module/authUtils");

//URI: diarylist/delete
router.delete('/', authUtil.isLoggedin, async (req, res) => {
    try{
        const userIdx = req.decoded.idx;
        console.log(userIdx);

        // const deleteUser = "DELETE FROM user,balloon,garden,diary USING user u JOIN balloon b ON u.userIdx = b.userIdx JOIN garden g ON u.userIdx = g.userIdx "+ 
        // "JOIN diary d ON u.userIdx = d.userIdx WHERE u.userIdx= ?";
        const deleteUser = 'DELETE FROM user WHERE userIdx = ?';

        const deleteUserResult = await db.queryParam_Parse(deleteUser, userIdx);

        if (deleteUserResult.length == 0) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.USER_DELETE_FAIL));
        } else {
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.USER_DELETE_SUCCESS));
        }
    }catch(err){
        console.log(err);
    }
});

module.exports = router;
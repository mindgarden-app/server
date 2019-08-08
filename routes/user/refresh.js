//access token재발급
var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const utils = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const jwtUtils = require('../../module/jwt');

router.post('/', async (req, res) => {

    const refreshToken = req.headers.refreshtoken;

    const selectUserQuery = 'SELECT * FROM user WHERE refresh_token = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, refreshToken);

    if (!selectUserResult) {// DB오류
        res.status(200).send(utils.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        if (selectUserResult[0] == null) {
            res.status(200).send(utils.successFalse(statusCode.OK, resMessage.INVALID_TOKEN));
        } else {
            const newAccessToken = jwtUtils.refresh(selectUserResult[0]);
            const token_result = [];
            var json = new Object();
            json.token = newAccessToken;
            token_result.push(json);
            //그리고 서버에서는 새롭게 발급한 newAccessToken의 refreshToken을 디비에 update한다.
            res.status(statusCode.OK).send(utils.successTrue(statusCode.OK, resMessage.REFRESH_TOKEN, token_result));
        }
    }
});

module.exports = router;

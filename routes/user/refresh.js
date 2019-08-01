//access token재발급
var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const jwtUtils = require('../../module/jwt');

router.get('/', async (req, res) => {

    const refreshToken = req.headers.refreshtoken;

    const selectUserQuery = 'SELECT * FROM user WHERE refresh_token = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, refreshToken);

    if (!selectUserResult) {// DB오류
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        if (selectUserResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_REFRESH_TOKEN_USER));
        } else {
            const newAccessToken = jwtUtils.refresh(selectUserResult[0]);
            res.status(statusCode.OK).send(defaultRes.successTrue(statusCode.OK, resMessage.REFRESH_TOKEN, newAccessToken));
        }
    }
});

module.exports = router;

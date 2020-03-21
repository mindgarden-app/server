var express = require('express');
var router = express.Router();

const passport = require('passport');

const db = require('../../module/pool');
const utils = require('../../module/utils');
const resMessage = require('../../module/responseMessage');
const statusCode = require('../../module/statusCode');

//애플로그인
//fullName, email, user저장
router.post('/', async(req, res) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const userIdentifier = req.body.user;//사용자의 고유한 값

    if(fullName == null && email == null){//기존 사용자
        const chkUserQuery = 'SELECT * FROM user WHERE id = ?';
        const chkUserResult = await db.queryParam_Parse(chkUserQuery, [userIdentifier]);

        const tokens = jwtUtils.sign(chkUserResult[0]);
        const refreshToken = tokens.refreshToken;
        const token = tokens.token;
        const UpdateRefreshQuery = 'UPDATE user SET refresh_token =? WHERE id =?';
        const UpdateRefreshResult = await db.queryParam_Parse(UpdateRefreshQuery,[refreshToken, userIdentifier]);
        if(UpdateRefreshResult.length == 0){
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.REFRESH_UPDATE_ERROR));
        }else{
            var json = new Object();
            json.refreshToken = refreshToken;
            json.token = token;
            json.name = fullName;
            json.email = email;
            json.expires_in = 3600
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, json));      
        }
    }else{//신규 사용자
        const insertUserQuery = 'INSERT INTO user (name, email, img, authType, password, id) VALUES (?, ?, ?, ?, ?, ?)';
        const insertUserResult = await db.queryParam_Parse(insertUserQuery, [fullName, email, null, 2, null, userIdentifier]);
        if(insertUserResult.length == 0){
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.USER_INSERT_FAIL));
        }else{
            const chkUserQuery_ = 'SELECT * FROM user WHERE id = ?';
            const chkUserResult_ = await db.queryParam_Parse(chkUserQuery_, [userIdentifier]);
            if(chkUserResult_.length == 0){
                res.status(200).send(util.successFalse(statusCode.OK, resMessage.NO_USER));
            }else{
                const tokens = jwtUtils.sign(chkUserResult_[0]);
                const refreshToken = tokens.refreshToken;
                const token = tokens.token;
                const UpdateRefreshQuery = 'UPDATE user SET refresh_token =? WHERE id =?';
                const UpdateRefreshResult = await db.queryParam_Parse(UpdateRefreshQuery,[refreshToken, userIdentifier]);
                if(UpdateRefreshResult.length == 0){
                    res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.REFRESH_UPDATE_ERROR));
                }else{
                    var json = new Object();
                    json.refreshToken = refreshToken;
                    json.token = token;
                    json.name = fullName;
                    json.email = email;
                    json.expires_in = 3600
                    res.status(200).send(util.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, json));                             
                } 
            }
        }
    }
});

module.exports = router;

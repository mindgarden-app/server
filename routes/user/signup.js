//자체 회원가입
//jwt 필요 없음
var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');

//body-id, name, pw, e-mail
router.post('/', async (req, res) => {
    const selectIdQuery = 'SELECT id FROM user WHERE id = ?'
    const selectIdResult = await db.queryParam_Parse(selectIdQuery, req.body.id);
    const signupQuery = 'INSERT INTO user (id,name,pw,salt) VALUES (?, ?, ?, ?)';


    if(selectIdResult[0] == null) {  //아이디 중복 없음
        const buf= await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedPw = await crypto.pbkdf2(req.body.pw.toString(), salt, 1000, 32, 'SHA512');
        const signupResult = await db.queryParam_Parse(signupQuery, [req.body.id, req.body.name, hashedPw.toString('base64'), salt]);
        if (!signupResult) {
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.USER_INSERT_FAIL));
        } else {  
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.USER_INSERT_SUCCESS));
        }
    } else {
        console.log("중복된 ID가 있습니다.");
        res.status(200).send(util.successFalse(statusCode.OK, resMessage.SIGNUP_FAIL));
    }
});
//id값이 null인 곳을 다 select해서 그 중에 중복된 email이 없으면 회원가입 성공/아니면 실패
module.exports = router;

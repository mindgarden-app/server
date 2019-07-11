var express = require('express');
var router = express.Router();

const passport = require('passport');

const db = require('../../module/pool');
const utils = require('../../module/utils');
const resMessage = require('../../module/responseMessage');
const statusCode = require('../../module/statusCode');


// kakao 로그인
router.get('/login/kakao',
    passport.authenticate('kakao')
);
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback',
    passport.authenticate('kakao', {
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/fail'
    })
);




router.get('/login/fail', (req, res) => {
    res.status(200).send(utils.successFalse(statusCode.INTERNAL_SERVER_ERROR, resMessage.LOGIN_FAIL));

});

router.get('/login/success', (req, res) => {
    console.log("===========");
    console.log(req._passport.session.user);
    res.status(200).send(utils.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, req._passport.session.user));
});

module.exports = router;

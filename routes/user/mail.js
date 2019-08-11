var express = require('express');
var router = express.Router();

const db = require('../../module/pool');
const utils = require('../../module/utils');
const resMessage = require('../../module/responseMessage');
const statusCode = require('../../module/statusCode');
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const mailinfo = require('../../config/mailconfig');
const crypto = require('crypto-promise');


//유효한 email인지 확인
//body-email
//body로 이메일을 입력받은 후 그 이메일이 user 테이블에 존재하는지 확인하고 있으면 그 이메일로 새로운 비밀번호 발급해주고 디비에 update
router.post('/', async (req, res,) => {
    const selectUserQuery = 'SELECT * FROM user WHERE email = ? AND id = ?';
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [req.body.email, 1]);//일반 로그인

    const rand = Math.floor(Math.random() * 9000)+1000;
    const rand_final = rand.toString();

    if(selectUserResult.length == 0){
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.UNDEFINED_EMAIL));//존재하지 않는 이메일
        console.log("Undefined User's MAIL");

    } else{
        const from = 'MINDGARDEN';
        const to = selectUserResult[0].email;
        const subject = 'MINDGARDEN 인증 메일입니다';
        const html = '<p>인증번호는 '+ rand + ' 입니다.\n';
        
        const mailOptions = {
            from,
            to ,
            subject,
            html 
        };
    
        
        const transporter = nodemailer.createTransport(smtpPool({
            service: mailinfo.config.mailer.service,
            host: mailinfo.config.mailer.host,
            port: mailinfo.config.mailer.port,
            auth: {
                user: mailinfo.config.mailer.user,
                pass: mailinfo.config.mailer.password,
            },
            tls: {
                rejectUnauthorize: false,
            },
            maxConnections: 5,
            maxMessages: 10,
        }));
    
        transporter.sendMail(mailOptions, (err, res) => {
            if (err) {
                console.log('메일 전송 실패', err);
                } else {
                console.log("메일 전송 완료");
            }
            transporter.close();
        });
        //db 새로운 비밀번호로 update
        const salt = selectUserResult[0].salt;
        const hashedPw = await crypto.pbkdf2(rand_final.toString(), salt, 1000, 32, 'SHA512');
        const updatePwQuery = 'UPDATE user SET password = ? WHERE email = ? AND id = ?';
        const updatePwResult = await db.queryParam_Parse(updatePwQuery,[hashedPw.toString('base64'), req.body.email, 1]);
        if (updatePwResult.length == 0) { 
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.UPDATE_PW_FAIL));
        } else {
            //매일 성공 통신
            res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEND_EMAIL_SUCCESS, rand_final));
            }
        }
    
});
module.exports = router;
    

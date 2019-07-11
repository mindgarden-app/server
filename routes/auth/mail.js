var express = require('express');
var router = express.Router();

const passport = require('passport');

const db = require('../../module/pool');
const utils = require('../../module/utils');
const resMessage = require('../../module/responseMessage');
const statusCode = require('../../module/statusCode');
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const mailinfo = require('../../config/mailconfig');

//인증번호 값
const rand = Math.floor(Math.random() * 10000)+1000;

//유효한 email인지 확인
router.get('/', async (req, res,) => {
    const selectEmailQuery = 'SELECT email FROM user WHERE userIdx = ?';
    const selectEmailResult = await db.queryParam_Parse(selectEmailQuery, req.body.userIdx);

    if(selectEmailResult.length == 0){
        console.log(2);
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.UNDEFINED_EMAIL));
        console.log("Undefined User's MAIL");

    } else{
        console.log(1);
        const from = 'MINDGARDEN';
        const to = selectEmailResult[0]['email'];
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

        //매일 성공 통신
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEND_EMAIL_SUCCESS, rand));
    }
    
});
module.exports = router;
    

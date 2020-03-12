var express = require('express');
var router = express.Router();
const util = require('../module/utils');
const statusCode = require('../module/statusCode');
const resMessage = require('../module/responseMessage');
const db = require('../module/pool');
const moment = require('moment');
const cron = require('node-cron');

cron.schedule('0 0 0 * * *', async() => {//자정에
    //모든 유저에 대해서 balloon table의 check=2, balloon=0으로 update
    const updateBalloonQuery = 'UPDATE balloon SET `balloon` = 2';
    const updateBalloonResult = await db.queryParam_None(updateBalloonQuery);
    console.log(updateBalloonResult);
})

cron.schedule('0 0 0 1 2 *', async() => {//매달 1일 00시에
    //29일(2), 30일(4, 6, 9, 11), 31일(1, 3, 5, 7, 8, 10, 12)
    //3개 insert(5,21,30), treeIdx-16, all user
    const insertGardenQuery_1 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
    const insertGardenQuery_2 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
    const insertGardenQuery_3 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
    const insertTransaction = await db.Transaction(async(connection) => {
        const garden_date = moment().format("YYYY-MM-DD ddd");
        const selectUserIdxQuery = 'SELECT userIdx FROM user';
        const selectUserIdxResult = await connection.query(selectUserIdxQuery);
        for(i=0;i<selectUserIdxResult.length;i++){
            const insertGardenResult_1 = await connection.query(insertGardenQuery_1, [garden_date, 5, 16, selectUserIdxResult[i]['userIdx']]);
            const insertGardenResult_2 = await connection.query(insertGardenQuery_2, [garden_date, 21, 16, selectUserIdxResult[i]['userIdx']]);
            const insertGardenResult_3 = await connection.query(insertGardenQuery_3, [garden_date, 30, 16, selectUserIdxResult[i]['userIdx']]);
        }
    });
    console.log(insertTransaction);
})

cron.schedule('0 0 0 1 4,6,9,11 *', async() => {//매달 1일 00시에
    //29일(2), 30일(4, 6, 9, 11), 31일(1, 3, 5, 7, 8, 10, 12)
    //2개 insert(21,30), treeIdx-16, all user
    const insertGardenQuery_1 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
    const insertGardenQuery_2 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
    const insertTransaction = await db.Transaction(async(connection) => {
        const garden_date = moment().format("YYYY-MM-DD ddd");
        const selectUserIdxQuery = 'SELECT userIdx FROM user';
        const selectUserIdxResult = await connection.query(selectUserIdxQuery);
        for(i=0;i<selectUserIdxResult.length;i++){
            const insertGardenResult_1 = await connection.query(insertGardenQuery_1, [garden_date, 21, 16, selectUserIdxResult[i]['userIdx']]);
            const insertGardenResult_2 = await connection.query(insertGardenQuery_2, [garden_date, 30, 16, selectUserIdxResult[i]['userIdx']]);
        }
    });
    console.log(insertTransaction);
})

cron.schedule('0 0 0 1 1,3,5,7,8,10,12 *', async() => {//매달 1일 00시에
    //29일(2), 30일(4, 6, 9, 11), 31일(1, 3, 5, 7, 8, 10, 12)
    //1개 insert(30), treeIdx-16, all user
    const insertGardenQuery_1 = 'INSERT INTO garden (date, location, treeIdx, userIdx) VALUES (?, ?, ?, ?)';
    const insertTransaction = await db.Transaction(async(connection) => {
        const garden_date = moment().format("YYYY-MM-DD ddd");
        const selectUserIdxQuery = 'SELECT userIdx FROM user';
        const selectUserIdxResult = await connection.query(selectUserIdxQuery);
        for(i=0;i<selectUserIdxResult.length;i++){
            const insertGardenResult_1 = await connection.query(insertGardenQuery_1, [garden_date, 30, 16, selectUserIdxResult[i]['userIdx']]);
        }
    });
    console.log(insertTransaction);
})

module.exports = router;
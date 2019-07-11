# MindGarden(마인드가든) - Node.js Server
------
- 마인드 가든은 하루의 이야기로 나만의 정원을 가꿔나가는 힐링 다이어리앱입니다. 
- 매일 일기를 기록하고 받은 나무와 꽃을 통해 정원을 가꿔나갈 수 있습니다. 
- 정원은 달마다 리셋되며 , 지난 정원은 앱 내에서 항상 볼 수 있습니다 . 
- 일기에서 날씨로 나의 상태를 기록하고 아름다운 나무와 꽃을 받아보세요 ! 
- 매일 기록할 수록 정원이 더욱 풍요로워집니다.


#### 2019 OPEN SOPT 24th Server Project

- 개발기간 :  2019년 6월 29일 ~ 2019년 7월 12일

------



## 주요기능

- [x] kakao 로그인/로그아웃

- [x] 비밀번호 분실시 메일 인증

- [x] 가든 화면

  - [x] 나무(리워드) 심기

    > 나무 심기는 일기를 쓴 후에 가능하다.

  - [x] 달 별로 사용자의 나무 정보 불러오기

  - [x] 말풍선 기능

    > 일기를 쓰고 나무(리워드)를 심지 않으면 정원에 말풍선이 뜬다.

- [x] 일기 쓰기

  - [x] 일기 등록

    > 일기 등록은 하루에 하나씩 가능하다.

  - [x] 일기 수정

    > 일기 수정은 언제든지 가능하다.

- [x] 일기 목록

  - [x] 달 별로 사용자의 일기 정보 불러오기

  - [x] 일 별로 정렬가능

  - [x] 일기 선택

    > 일기 선택시 구체적인 일기 내용, 기분, 사진을 보여준다.

  - [x] 일기 삭제

    > 특정 날짜의 일기 삭제 가능하다.

## ERD

![](https://jungah.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2019-07-11+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+9.58.12.png)



------



# Server Architecture

![](https://jungah.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2019-07-10+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+11.04.04.png)



## 개발 환경& 프레임워크

- mysql
- Workbench
- Node.js
- vscode
- Express.js
- NPM
- PM2
- AWS EC2
- AWS RDS
- AWS S3



## 의존성

  "dependencies": {

​    "aws-sdk": "^2.488.0",

​    "connect-flash": "^0.1.1",

​    "cookie-parser": "~1.4.3",

​    "debug": "~2.6.9",

​    "express": "~4.16.0",

​    "express-session": "^1.16.2",

​    "http-errors": "^1.6.3",

​    "jade": "~1.11.0",

​    "moment": "^2.24.0",

​    "morgan": "~1.9.0",

​    "multer": "^1.4.1",

​    "multer-s3": "^2.9.0",

​    "node-cron": "^2.0.3",

​    "nodemailer": "^6.2.1",

​    "nodemailer-smtp-pool": "^2.8.3",

​    "passport": "^0.4.0",

​    "passport-kakao": "0.0.5",

​    "promise-mysql": "^3.3.2"

  }



## 배포 

- AWS EC2
- AWS RDS
- AWS S3

 

## Contributor

- [이지영](https://github.com/jiyoung1202) (jiyoung1202)

- [신정아](https://github.com/jungahshin) (jungahshin)

- [이지수](https://github.com/ljsgold2001) (ljsgold2001)

  <br>

## 시연영상

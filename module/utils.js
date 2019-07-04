const authUtil = {
    successTrue: (status, message, data) => {//성공했을 때에 (서버상의 상태코드, 메세지, 값)
        return {
            status: status,
            success: true,
            message: message,
            data: data
        }
    },
    successFalse: (status, message) => {//실패 했을 때에

        return {
            status: status,
            success: false,
            message: message
        }
    },
};

module.exports = authUtil;
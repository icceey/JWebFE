
exports.PATTERN = {
    USERNAME: /^[a-zA-Z0-9_]{1,20}$/,
    NICKNAME: /^[a-zA-Z0-9\u4E00-\u9FA5_]{1,20}$/,
    EMAIL: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+.([A-Za-z]{2,4})$/,
    PHONE: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
}


exports.RESPONSE = {
    SUCCEES: 0,
    FAIL: 1,
    SESSION_EXPIRE: 2,
    EXCEPTION: 9
}


exports.STORAGE_KEY = {
    USER: 'user'
}


exports.VIEW_MODE = {
    ALL: '',
    UNDO: 'undo',
    DONE: 'done'
}


// exports.SERVER = 'http://localhost:8000'
exports.SERVER = 'http://10.64.28.37:8000'
/*export default class Errcode1 extends Error {
    static ERR_UNKNOWN = 40001;
    static ERR_CODE1 = 40002;
    static ERR_PARAM_ERROR = 40003;
    static ERR_NO_SUCH_ENTITY = 40004;
    static ERR_ALREADY_EXIST = 40005;
    static ERR_USER_NO_BASEINFO = 40006;
    static ERR_USER_DUP_LOGIN = 40007;
    static ERR_USER_DUP_EMAIL = 40008;
    static ERR_USER_CREATE_FAIL = 40009;
    static ERR_USER_UPDATE_FAIL = 40010;
    

    constructor(message, errcode=ERR_UNKNOWN) {
        super(message);
        this.name = this.constructor.name;
        this.message = message; 
        this.errcode = errcode;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = (new Error(message)).stack;
        }
    }
    toJSON () {
        return { errcode: this.errcode, msg: this.message };
    }
}

export class Errcode extends Errcode1 {}
*/


/*
export const ERR_UNKNOWN = 40001;
export const ERR_CODE1 = 40002;
export const ERR_PARAM_ERROR = 40003;
export const ERR_NO_SUCH_ENTITY = 40004;
export const ERR_ALREADY_EXIST = 40005;
*/
/*
// now I can extend
class MyError extends Errcode {}

//var myerror = new MyError("ll");
var myerror = new Errcode("ll");
console.log(myerror.message);
console.log(myerror.errcode);
console.log(myerror instanceof Error);
console.log(myerror.name);
console.log(myerror.stack);
*/

export const ERR_UNKNOWN = 40001;
export const ERR_CODE1 = 40002;
export const ERR_PARAM_ERROR = 40003;
export const ERR_NO_SUCH_ENTITY = 40004;
export const ERR_INSERT_DB_FAIL = 40005;
export const ERR_UPDATE_DB_FAIL = 40006;
export const ERR_ALREADY_EXIST = 40007;
export const ERR_MISS_REQUIRE = 40008;
export const ERR_USER_NO_BASEINFO = 40020;
export const ERR_USER_DUP_LOGIN = 40021;
export const ERR_USER_DUP_EMAIL = 40022;
export const ERR_USER_CREATE_FAIL = 40023;
export const ERR_USER_UPDATE_FAIL = 40024;
export const ERR_USER_UPD_NO_USER = 40025;
export const ERR_TAXONOMY_DUP_TERM = 40030;
export const ERR_POST_TYPE_CHANGE_NOT_ALLOW = 40040;
export const ERR_POST_MISS_REQUIRE = 40041;

export const ERR_FILE_READ_FAIL = 44001;
export const ERR_UPLOAD_FAIL = 44002;
export const ERR_UPLOAD_USER_ABORT = 44003;

export default function Errcode(message, errcode=ERR_UNKNOWN) {
    this.name = 'Errcode';
    this.message = message || '';
    this.errcode = errcode;
    this.stack = (new Error()).stack;
    this.toJSON = () => {
        return { errcode: this.errcode, msg: this.message };
    }
}
Errcode.prototype = Object.create(Error.prototype);
Errcode.prototype.constructor = Errcode;

import _debug from 'debug'
const debug = _debug('app:server:lottery')
import moment from 'moment';
import _ from 'lodash';

const LotteryTypeMap = {
    cqssc: {
        name: '重庆时时彩',
        czKJNextTime: 574,
        kJCZInfo:572,
    },
}

export class Lottery {
    constructor () {
        this.InfoMap = {};
        this.updateLoop();
    }
    _request (url, opts = {}) {
        debug ("_request", url);
        return fetch(url, {...opts, credentials: 'include'})
            .then (data => data.json())
            .then (retobj => {
                if (retobj){
                    //debug ("_request fetch return:", retobj);
                    if (!retobj.errcode || retobj.errcode === 0) {
                        //debug ("no error!");
                    } else {
                        debug ("get error!");
                    }
                    return retobj;
                } else {
                    //debug ("should not reach here! fetch none!");
                    throw new Error ("response nothing! should not happen!");
                }
            })
            .catch (error => {
                debug ("fetch error!", error);
                return { errcode:-2, message: error.message };
            })
    }
    
    get (url) {
        var opts = {
            //dataType: 'json',
            method: 'GET',
            headers: {
                'Host': 'kaijiang.zhcw.com',
                'Referer': 'http://www.zhcw.com/kj/xndg/cq/ssc/index.shtml',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        return this._request(url, opts);
    }

    czKJNextTime (czId) {
        // {"yMdHms":"2017-03-16 13:30:00","nextTime":"366708","dayOfWeek":"5"}
        return this.get("http://kaijiang.zhcw.com/czKJNextTime.jsp?czId="+czId)
            .then(retobj => {
                //debug ("czKJNextTime:", retobj);
                if (retobj.yMdHms && retobj.nextTime) {
                    var date = moment(retobj.yMdHms,"YYYY-MM-DD HH:mm:ss").toDate();
                    return {...retobj, date};
                } else {
                    throw new Error ("error! czKJNextTime fail!");
                }
            });
    }
    kJCZInfo (czId, count = 1){
        // {"572":{"20170316038":{"JNum":"","QNum":"","TOne":"","bonusEight":0,"bonusFive":0,"bonusFour":0,"bonusOne":0,"bonusPool":0,"bonusSeven":0,"bonusSix":0,"bonusThree":0,"bonusTop":0,"bonusTwo":0,"czArea":"","czId":"572","czName":"重庆时时彩","czType":"","description":"","dqName":"","issue":"20170316038","kjDate":"2017-03-16 00:00:00","kjTNum":"","kjZNum":"4 5 9 7 5","nextTime":0,"noteEight":0,"noteFive":0,"noteFour":0,"noteOne":0,"noteSeven":0,"noteSix":0,"noteThree":0,"noteTop":0,"noteTwo":0,"sales":0,"sjNum":"","timeBegin":null,"timeEnd":null,"timeSpan":""}}}
        return this.get("http://kaijiang.zhcw.com/kJCZInfo.jsp?czId="+czId+"&issueNum="+count+"&formatType=jsonMap").then(retobj => {
            //debug ("kJCZInfo:", retobj);
            var level1Keys = _.keys(retobj);
            for (var i = 0; i < level1Keys.length; i++) {
                var rtCzId = level1Keys[i];
                var l1Obj = retobj[rtCzId];
                var level2Keys = _.keys(l1Obj);
                for (var j = 0; j < level2Keys.length; j++) {
                    var issue = level2Keys[j];
                    var l2Obj = l1Obj[issue];
                    return {czId:l2Obj.czId, 
                            czName:l2Obj.czName,
                            issue: l2Obj.issue,
                            kjZNum: l2Obj.kjZNum,
                            date: new Date()};
                }
            }
            throw new Error ("error! kJCZInfo fail! not get result!");
        });
    }

    async _updateLastAndNext () {
        // get last result and next time.
        var lotteryTpye='cqssc';
        var ltyCfg = LotteryTypeMap[lotteryTpye];
        if (!this.InfoMap[lotteryTpye]) this.InfoMap[lotteryTpye] = {};
        var lottery = this.InfoMap[lotteryTpye];

        var idkJCZInfo = ltyCfg.kJCZInfo;
        var idczKJNextTime = ltyCfg.czKJNextTime;

        var olast = lottery.last;
        var onext = lottery.next;

        var last2 = await this.kJCZInfo (idkJCZInfo);
        if (last2 && (last2.issue != (olast && olast.issue))) {
            debug ("issue change, update last to ", last2);
            lottery.last = last2;
        } else {
            var onextDate = lottery.next && lottery.next.date || new Date(0);
            if (last2 && (last2.date < onextDate)) {
                throw new Error ("error! get same issue! maybe the server is in calculation! wait a short time, then try again!");
            }
        }

        var next2 = await this.czKJNextTime (idczKJNextTime);
        if (next2) {
            debug ("update next to ", next2);
            lottery.next = next2;
        }

        return true;
    }

    updateLoop () {
        var lotteryTpye='cqssc';
        var ltyCfg = LotteryTypeMap[lotteryTpye];
        if (!this.InfoMap[lotteryTpye]) this.InfoMap[lotteryTpye] = {};
        var lottery = this.InfoMap[lotteryTpye];

        this._updateLastAndNext()
            .then (() => {
                var timeout = parseInt(lottery.next && lottery.next.nextTime || 60000);
                this.updateTimer = setTimeout (this.updateLoop.bind(this), timeout);
                debug ("updateLoop 2");
            }).catch ((e) => {
                this.updateTimer = setTimeout (this.updateLoop.bind(this), 30000);
                debug ("error! updateLoop: ", e);
            })
    }

    async getResultAfterTime (checkDate) {
        if (!checkDate) {
            return {errcode: -1, message: 'should supply checkDate!'};
        }
        checkDate = new Date(checkDate);
        var lotteryTpye='cqssc';
        var lottery = this.InfoMap[lotteryTpye];
        var lastDate = lottery.last && lottery.last.date || new Date(0);
        var nextDate = lottery.next && lottery.next.date || new Date(0);
        debug ("checkDate:", checkDate, ", lastDate:", lastDate, ", nextDate:", nextDate);
        if (checkDate < lastDate) {
            // use exist last date.
            return {kj: lottery.last.kjZNum};
        } else {
            // return next time.
            return lottery.next;
        }
    }
/*
    async getResultAfterTime (checkDate, lotteryTpye='cqssc') {
        if (!checkDate) {
            return {errcode: -1, message: 'should supply checkDate!'};
        }
        checkDate = new Date(checkDate);
        // 寻找大于给定时间的后一期中奖号码
        var ltyCfg = LotteryTypeMap[lotteryTpye];
        if (!ltyCfg) {
            return {errcode: -1, message: 'no such lottery='+lotteryType};
        }
        if (!this.InfoMap[lotteryTpye]) this.InfoMap[lotteryTpye] = {};
        var lottery = this.InfoMap[lotteryTpye];

        var lastDate = lottery.last && lottery.last.date || 0;
        var nextDate = lottery.next && lottery.next.date || 0;
        debug ("checkDate:", checkDate, ", lastDate:", lastDate, ", nextDate:", nextDate);
        if (checkDate < lastDate) {
            // use exist last date.
            return {kj: lottery.last.kjZNum};
        }
        // check whether the next is newest.
        var now = new Date();
        if (nextDate > now) {
            // newest. need wait for secret.
            return lottery.next;
        }
        // need fetch new 
        var next2 = await this.czKJNextTime (ltyCfg.czKJNextTime);
        if (next2 && next2.date != nextDate) {
            debug ("update next:", next2);
            lottery.next = next2;
        }
        var last2 = await this.kJCZInfo (ltyCfg.kJCZInfo);
        if ((last2 && last2.issue) != (lottery.last && lottery.last.issue)) {
            debug ("update last:", last2);
            lottery.last = last2;
            if (checkDate < last2.date) {
                // use new last date.
                return {kj: lottery.last.kjZNum};
            }
        }

        if (lottery.next) return lottery.next;
        else {
            debug ("should not happen! some error occour!");
            return {errcode: -1, message: 'some error occour!'};
        }
    }
*/
}

export default (new Lottery());
/*
{
    cqssc: {
        next: {yMdHms:"2017-03-16 13:30:00",nextTime:"366708",dayOfWeek:"5"},
        last: {czId:"572",czName:"重庆时时彩",issue:"20170316038", kjZNum:"4 5 9 7 5", date: new Date()}
    }
}
*/

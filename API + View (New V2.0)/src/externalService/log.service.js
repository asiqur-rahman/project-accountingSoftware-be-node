'use strict';
const fs = require('fs');
const path = require('path');
var getDirName = require('path').dirname;
const _config = require('../../config/config.json');

module.exports = class Logger {
    constructor(appName) {
        if (appName) this.appName = appName;
        else this.appName = 'N/A';
        this.debugOn = _config.logSettings.DebugLog;
        this.cLogOn = _config.logSettings.ConsoleLog;
    }

    /**
     * Console debug logs
     * @param {string} msg message
     * @param {object} op optional params
     * @returns
     */
    debug(msg, op = '') {
        if (this.debugOn === false) return;
        console.debug('[' + this.getDateAsText() + '] [' + this.appName + '] ' + msg, op);
    }

    /**
     * Console logs
     * @param {string} msg message
     * @param {object} op optional params
     * @returns
     */
    log(msg, op = '') {
        console.log('[' + this.getDateAsText() + '] [' + this.appName + '] ' + msg, op);
    }

    /**
     * Console info logs
     * @param {string} msg message
     * @param {object} op optional params
     * @returns
     */
    info(msg, op = '') {
        console.info('[' + this.getDateAsText() + '] [' + this.appName + '] ' + msg, op);
    }

    /**
     * Console warning logs
     * @param {string} msg message
     * @param {object} op optional params
     * @returns
     */
    warn(msg, op = '') {
        console.warn('[' + this.getDateAsText() + '] [' + this.appName + '] ' + msg, op);
    }

    /**
     * Console error logs
     * @param {string} msg message
     * @param {object} op optional params
     * @returns
     */
    error(msg, op = '') {
        console.error('[' + this.getDateAsText() + '] [' + this.appName + '] ' + msg, op);
    }

    appendZeroToLength(value, length) {
        return `${value}`.padStart(length, '0');
    }
    
    getDateAsText() {
        const now = new Date();
        const nowText = this.appendZeroToLength(now.getFullYear(), 4) + '.'
            + this.appendZeroToLength(now.getMonth() + 1, 2) + '.'
            + this.appendZeroToLength(now.getDate(), 2) + ', '
            + this.appendZeroToLength(now.getHours(), 2) + ':'
            + this.appendZeroToLength(now.getMinutes(), 2) + ':'
            + this.appendZeroToLength(now.getSeconds(), 2) + ':'
            + this.appendZeroToLength(now.getMilliseconds(), 3  ) ;
        return nowText;
    }

    CreateLog(logFileDetails, ...text) {
        console.log(logFileDetails,path.join(__dirname, '..', '..' ,'logs'))
        this.debug(text.join(' || '));
        const logPath = path.join(__dirname, '..', '..', 'logs', logFileDetails.folderName , logFileDetails.fileName);
        // var previousText='';
        // fs.readFile(logPath, 'utf8', (err, data) => {
        //     if (err) {
        //       console.error(err);
        //       return;
        //     }
        //     previousText=data;
        // });
        // if(isJsonString(previousText)){
        //     previousText=JSON.parse(previousText);
        //     if(!previousText[`${this.appName}`])previousText=[`${this.appName}`={}]
        // }else{
        //     previousText=[`${this.appName}`={}]
        // }
        const logText = '['+this.getDateAsText() + '] [' + this.appName +'] '+ text.join(' || ') + '\n';
        fs.mkdir(getDirName(logPath), { recursive: true}, function (err) {
            if (err) return cb(err);
            fs.appendFile(logPath, logText, 'utf8', function (error) {
                if (error) {
                    console.log(this.getDateAsText() + ' ' + error);
                }
            });
        });
    }

    GetLog() {
        const mainPath = path.join(__dirname, 'log.log');
          if (fs.existsSync(mainPath)) {
              res.download(mainPath)
          }else{
            return res.status(500).json({
              Result: 'No Log Found !'
            });
        }
    }

    CreateSession(req,token,preSession=[]) {
        var clientIp= req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        console.log(clientIp)
        if(clientIp){
            const logPath = path.join(__dirname, '..', '..', 'logs', 'session' , 'data.json');

            fs.readFile(logPath,"utf8", (err, data) => {
                if (err) return [];
                var preSession = data?JSON.parse(data):[];
                var notFound=true;
                preSession.map((item)=>{
                    if(item.IP===clientIp){
                        item.token=token;
                        notFound=false;
                    }
                })
                if(notFound)preSession.push({IP:clientIp,token:token});
                const logText = JSON.stringify(preSession, null, 2);
                fs.mkdir(getDirName(logPath), { recursive: true}, function (err) {
                    if (err) return cb(err);
                    fs.writeFileSync(logPath, logText, 'utf8', function (error) {
                        if (error) {
                            console.log(this.getDateAsText() + ' ' + error);
                        }
                    });
                });
            });
            
            
        }
    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
};

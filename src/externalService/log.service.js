const fs = require('fs');
const path = require('path');
var getDirName = require('path').dirname;

module.exports.CreateLog = (logText,logFileName=false)=>{
    logToFile(logText, logFileName==false?'log.log':logFileName+'.log');
}

module.exports.GetLog = () =>{
    const mainPath = path.join(__dirname, 'log.log');
      if (fs.existsSync(mainPath)) {
          res.download(mainPath)
      }else{
        return res.status(500).json({
          Result: 'No Log Found !'
        });
    }
}

//#region Log Helper
function appendZeroToLength(value, length) {
    return `${value}`.padStart(length, '0');
}

function getDateAsText() {
    const now = new Date();
    const nowText = appendZeroToLength(now.getFullYear(), 4) + '.'
        + appendZeroToLength(now.getMonth() + 1, 2) + '.'
        + appendZeroToLength(now.getDate(), 2) + ', '
        + appendZeroToLength(now.getHours(), 2) + ':'
        + appendZeroToLength(now.getMinutes(), 2) + ':'
        + appendZeroToLength(now.getSeconds(), 2) ;
    return nowText;
}

function logToFile(text, file, delimiter = '\n') {
    const logPath = path.join(__dirname, '..', '..', 'public', 'Log', file);
    const logText = getDateAsText() + ' --> ' + text + delimiter;
    // fs.appendFile(logPath, logText, 'utf8', function (error) {
    //     if (error) {
    //         console.log(getDateAsText() + ' --> ' + error);
    //     }
    // });
    fs.mkdir(getDirName(logPath), { recursive: true}, function (err) {
        if (err) return cb(err);
    
        fs.appendFile(logPath, logText, 'utf8', function (error) {
            if (error) {
                console.log(getDateAsText() + ' --> ' + error);
            }
        });
    });
}

function writeFile(path, contents, cb) {
    
  }
//#endregion
const moment = require('moment-timezone');
exports.getPlaceholderStringForArray = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error('Invalid input');
    }

    // if is array, we'll clone the arr 
    // and fill the new array with placeholders
    const placeholders = [...arr];
    return placeholders.fill('?').join(', ').trim();
}


exports.multipleColumnSet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);

    columnSet = keys.map(key => `${key} = ?`).join(', ');

    return {
        columnSet,
        values
    }
}


class CustomDateTime {
    
    constructor(dateTime) {
        // console.log("CustomDateTime Before",dateTime)
        this.dateTime = moment(dateTime).format()//.replace("+00", "+10");
        // console.log("CustomDateTime After",this.dateTime)
    }
 
    getDay() {
        return moment(this.dateTime).utc().day();
    }

    getDate() {
        return moment(this.dateTime).utc().date();
    }

    getMonth() {
        return moment(this.dateTime).utc().month()+1;
    }

    getUTC(format=null,obj=false) {
        return obj?moment(this.dateTime).utc():moment(this.dateTime).utc().format(format);
    }

    getBDT(format=null,obj=false) {
         return obj?moment(this.dateTime):this.dateTime.format(format);
    }

    getAUS(format=null,obj=false) {
        return  obj?moment(this.dateTime).tz('Australia/Sydney'):moment(this.dateTime).tz('Australia/Sydney').format(format);
    }
 }

 module.exports = { CustomDateTime }

class CustomDateTime {
    
    constructor(dateTime) {
        this.dateTime = moment(dateTime).format().replace("+00", "+06");
    }
 
    getDay() {
        return moment(this.dateTime).day();
    }

    getDate() {
        return moment(this.dateTime).date();
    }

    getMonth() {
        return moment(this.dateTime).month()+1;
    }

    getUTC(obj=false) {
        return obj?moment(this.dateTime).utc():moment(this.dateTime).utc().format();
    }

    getBDT(obj=false) {
         return obj?moment(this.dateTime):this.dateTime;
    }

    getAUS(obj=false) {
        return  obj?moment(this.dateTime).tz('Australia/Sydney'):moment(this.dateTime).tz('Australia/Sydney').format();
    }
 }

 module.exports = { CustomDateTime }
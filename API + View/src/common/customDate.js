module.exports.getDayName=(dateStr, locale='default')=>{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

module.exports.daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}
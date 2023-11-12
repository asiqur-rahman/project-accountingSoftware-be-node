const Op = require('sequelize').Op;
const sequelize = require('sequelize');

module.exports.paginationHelper = (req, coloums, condition = {}) => {
 
    //-----------------Server side pagination----------------------
    const order = req.query.columns[req.query.order[0].column].data=='sl'?[]:sequelize.literal(req.query.columns[req.query.order[0].column].data+" "+req.query.order[0].dir);//req.query.order[0].column=='0'?[]:[[req.query.columns[req.query.order[0].column].data,req.query.order[0].dir]];
    var searchQuery=[];
    var searchQuery=[];
    
    coloums.forEach(element => {
        searchQuery.push(sequelize.col(element));
    });
    
    var where = {};
    if(req.query.search.value!=''){
        where = {
            [Op.and]: [
                sequelize.where(sequelize.fn("concat",...searchQuery), "like", '%'+req.query.search.value+'%' ),
                condition
                ]
        }
    }else{
        where = {
            [Op.and]: [ 
                condition
            ]
        }
    }
    //-----------------Server side pagination----------------------
    return {where,order};
}

module.exports.getDayName=(dateStr, locale='default')=>{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

module.exports.daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}
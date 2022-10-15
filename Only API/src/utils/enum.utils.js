var Enum = require('enum');

    module.exports.Role={
        SuperUser: '1',
        Admin: '2',
        user:'5'
    }

    module.exports.AccountHead=new Enum({
        Assets: '101',
        Equity: '201',
        Expenses: '301',
        Income: 401,
        Liabilities: 501
    });
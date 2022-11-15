var Enum = require('enum');

    module.exports.status={
        UA: 'Unauthorize Access',
        Success: 'Success',
        Failed:'Failed'
    }

    module.exports.Role={
        Admin: '1',
        User:'5'
    }

    module.exports.paymentType={
        Cash: '1',
        Cheque: '2',
        BankTransfer: '3'
    }

    module.exports.notification={
        Error: 'error',
        Info: 'info',
        Warning: 'warning',
        Success: 'success'
    }

    module.exports.AccountHead=new Enum({
        Assets: 101,
        Equity: 201,
        Expense: 301,
        Income: 401,
        Liabilities: 501
    });

    module.exports.logFor={
        auth: {folderName:"auth",fileName:new Date().toDateString()},
        route: {folderName:"route",fileName:new Date().toDateString()},
    }
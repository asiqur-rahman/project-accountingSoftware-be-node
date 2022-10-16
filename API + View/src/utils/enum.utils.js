var Enum = require('enum');

    module.exports.status={
        UA: 'Unauthorize Access',
        Success: 'Success',
        Failed:'Failed'
    }

    module.exports.Role={
        SuperUser: '1',
        Admin: '2',
        user:'5'
    }

    module.exports.paymentType={
        Cash: '1',
        Cheque: '2',
        BankTransfer: '3'
    }

    module.exports.notification={
        Error: 'errorMsg',
        Info: 'infoMsg',
        Warning: 'warMsg',
        Success: 'succMsg'
    }

    module.exports.AccountHead=new Enum({
        Assets: '101',
        Equity: '201',
        Expenses: '301',
        Income: 401,
        Liabilities: 501
    });
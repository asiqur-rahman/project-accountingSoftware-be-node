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

    module.exports.salesStatus=new Enum({
        Pending: '0',
        Processing: '1',
        Completed: '2',
        Rejected: '3',
        Cancelled: '4'
    });

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

    module.exports.logFor={
        backOffice: {folderName:"backOffice",fileName:new Date().toDateString()},
        videoConference: {folderName:"videoConference",fileName:new Date().toDateString()},
        customerRegistration: {folderName:"customerRegistration",fileName:new Date().toDateString()},
    }
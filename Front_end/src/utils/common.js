
const CryptoJS = require("crypto-js");

// export const getLoggedInUser = () => {
//     const cookies = new Cookies();
//     const user = cookies.get('user');
//     return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
// };

export const encrypt= (data) => {
    if(data){
        return  CryptoJS.DES.encrypt(data, CryptoJS.enc.Utf8.parse('@Shik-SE'),{ iv: { words: [ 0, 0, 0, 0 ], sigBytes: 16 } }).toString();
    }
    else{
        return null;
    }
}

export const decrypt= (data) => {
    if(data){
        const bytes= CryptoJS.DES.decrypt(data, CryptoJS.enc.Utf8.parse('@Shik-SE'),{ iv: { words: [ 0, 0, 0, 0 ], sigBytes: 16 } });
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    else{
        return null;
    }
}

export const current= (name) => {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();

    switch(name){
        case 'day':return day;
        case 'month':return month;
        case 'year':return year;
        default:return date;
    }
}

export const setCharAt=(str,index,chr) =>{
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

export const method = {
    post: 'POST',
    get: 'GET',
    put: 'PUT',
    delete: 'DELETE'
}
